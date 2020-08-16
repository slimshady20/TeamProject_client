import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    GoogleMap,
    Marker,
    InfoWindow, LoadScript, Polyline,
} from "@react-google-maps/api";
import Geocode from 'react-geocode'
import {
    homeIcon,
    arrowMarker,
} from "./mapIcons/imgIndex";
import axios from "axios";
import {Button,ListGroup} from "react-bootstrap";
import {libraries,containerStyle,dottedLine} from "./mapUtils/mapatt";

Geocode.setApiKey("AIzaSyBCjj2hELnBZqNrfMSwlka2ezNRrysnlNY");



const FindBestRoute=()=> {

    const [lineShow, setLineShow] = useState(true);// 폴리라인 조건부랜더링
    const [center, setCenter] = useState({lat: 37.73633262, lng: 127.0447991}); //지도 센터 좌표
    const [myLoca,setMyLoca] = useState("");
    const [infoShow, setInfoShow] =useState(false);
    const [bestWay,setBestWay] = useState([])
    const [map, setMap] = useState(null);
    const [inputValue,setInputValue] =useState(""); //검색어
    const [stores, setStores] =useState([]);
    const [homePosit,setHomePosit]=useState({lat: 37.73633262, lng: 127.0447991});
    const [dropShow,setDropShow]=useState(false);
    const [shortSearched, setShortSearched] = useState([]);
    const [markerShow, setMarkerShow] = useState(false);
    const [paths, setPaths] = useState([]); //polyline pathCoordinate
    const mapRef = useRef();
    const onMapLoad = useCallback(map => {
        mapRef.current = map;
    }, []);
    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    function getshorList(){
        setShortSearched([
            {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"",storePhone:"",latitude:0,longitude:0},
            {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"",storePhone:"",latitude:0,longitude:0},
            {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"",storePhone:"",latitude:0,longitude:0}
            ]);
        if(inputValue){
            axios.get(`http://localhost:8080/stores/realTimeSearch/${inputValue}`)
                .then(({data})=>{
                    if(data.list!=0){
                        setShortSearched(data.list);
                        (shortSearched.length!=0)?setDropShow(true):setDropShow(false);
                    }
                    else{
                        // console.log(data.msg);
                        setShortSearched([
                            {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"",storePhone:"",latitude:0,longitude:0},
                            {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"",storePhone:"",latitude:0,longitude:0},
                            {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"",storePhone:"",latitude:0,longitude:0}
                        ]);
                        setDropShow(false);}
                })
                .catch(err=>{console.log(err);throw err; })
        }
    }//실시간 검색 드롭다운 함수

    useEffect(()=>{
        console.log("useEffect getsearched");
        setDropShow(false);
        getshorList();
    },[inputValue]) //검색 드롭다운 유즈이펙트
    const realTimeSearch=e=>{
        e.preventDefault();
        let value = e.target.value;
        if(value.charAt[0]!='') setInputValue(e.target.value);
    } //검색창 온체인지 함수


    let temRoutes =[
        {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"1번주소",storePhone:"",latitude:37.746897,longitude:127.030861},
        {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"2. 주소",storePhone:"",latitude:37.745897,longitude:127.040831},
        // {storeName:"",mainCode:"",storeType:"",storeTypeCode:0, address:"3. 주소",storePhone:"",latitude:37.746197,longitude:127.030861}
        ]


    function selectRoute (routeInfo){
        if(temRoutes.length<3){
            temRoutes[temRoutes.length]=routeInfo;
        }
    }

    const getLatLng = (location) => {
        Geocode.fromAddress(location).then(
            response => {
                const resLatLng = response.results[0].geometry.location;
                alert(`받아온 좌표${JSON.stringify(resLatLng)}`)
                setHomePosit({lat: Number(resLatLng.lat), lng: Number(resLatLng.lng)});
                setCenter(homePosit);
                console.log(`getLatLng ${resLatLng.lat} ${resLatLng.lng}`);
            },
            error => {
                console.error(error);
            }
        );
    }//get user latitude and longitude from user address

    const markerfnc =()=>{
        if(temRoutes.length!=0){
            setMarkerShow(true);
        };
    }
    const getBestSeq=(homePosition, stopOverList)=>{
        const homePosit = homePosition;// start, end position
        const stopOver = stopOverList; // middle positions, must be like [{lat: 0, lng: 0}, ...]
        let results = [];
        let index =0;
        switch(stopOverList.length){
            case 1:break ;
            case 2:for(let i = 0;i<stopOver.length;i++){
                     for(let j = 0;j<stopOver.length;j++){
                        if(i!=j){
                            let ways = [i,j]
                            results[index]={way: ways, distance:(
                                    Math.sqrt(Math.pow((Number(homePosit.lat)-stopOver[i].latitude),2)+Math.pow((Number(homePosit.lng) - stopOver[i].longitude),2))+
                                    Math.sqrt(Math.pow((stopOver[i].latitude-stopOver[j].latitude),2)+Math.pow((stopOver[i].longitude - stopOver[j].longitude),2))+
                                    Math.sqrt(Math.pow((Number(homePosit.lat)-stopOver[j].latitude),2)+Math.pow((Number(homePosit.lng) - stopOver[j].longitude),2))
                                )};
                            index++
                        }
                    }}break ;
            case 3:for(let i = 0;i<stopOver.length;i++){
                    for(let j = 0;j<stopOver.length;j++){
                        for(let k = 0;k<stopOver.length;k++){
                            if(i!=j&&j!=k&&k!=i){
                                let ways = [i,j,k]
                                results[index]={way: ways, distance:(
                                        Math.sqrt(Math.pow((homePosit.lat-stopOver[i].latitude),2)+Math.pow((homePosit.lng - stopOver[i].longitude),2))+
                                        Math.sqrt(Math.pow((stopOver[i].latitude-stopOver[j].latitude),2)+Math.pow((stopOver[i].longitude - stopOver[j].longitude),2))+
                                        Math.sqrt(Math.pow((stopOver[j].latitude-stopOver[k].latitude),2)+Math.pow((stopOver[j].longitude - stopOver[k].longitude),2))+
                                        Math.sqrt(Math.pow((homePosit.lat-stopOver[k].latitude),2)+Math.pow((homePosit.lng - stopOver[k].longitude),2))
                                    )};
                                index++
                            }
                        }}
                    }break ;
            default: return "경유지를 입력해주세요"
        }


        if(results.lenght!==0){
            const forSortList = [];
            results.map(elem=>{
                forSortList.push(elem.distance)
            });
            for(let i=0;i<results.length;i++){
                if(Math.min.apply(null,forSortList)===results[i].distance){
                    setBestWay(results[i].way);
                };
             };
            }

    }//최단거리 구하기






    function makePath (){
        let tmpPath=[];
        if(temRoutes.length>1){
            tmpPath[0]=homePosit;
            for(let i=0; i<temRoutes.length;i++){
                tmpPath[i+1]={lat:temRoutes[bestWay[i]].latitude, lng:temRoutes[bestWay[i]].longitude};
            }
            tmpPath[temRoutes.length+1]=homePosit;
            console.log("tmpPath"+tmpPath)
            setPaths(tmpPath);
            console.log(tmpPath);
        }
    }



    useEffect(() => {
        setMyLoca(JSON.parse(sessionStorage.getItem("accountDetail")).defaultAddr)
        getLatLng(myLoca);
    }, [homePosit]); // 주소로 유저 좌표 가져오기

    useEffect(()=>{
        markerfnc();
    },[temRoutes])
    useEffect(()=>{
        console.log("useEffect getStoreList")
        if(!stores[0]) {
            axios.get(`http://localhost:8080/stores/mapClick/의정부`)
                .then(({data})=>{
                    setStores(data.list);
                })
                .catch(err=>{throw(err)});
        };

    },[stores]);
    return (<>
        <h3>&nbsp;&nbsp;최적 경로 찾아보기</h3><br/>
        <table>
            <tr><td>
                <div className="first_td">
                    <LoadScript
                        googleMapsApiKey="AIzaSyBCjj2hELnBZqNrfMSwlka2ezNRrysnlNY"
                        libraries={libraries}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            onUnmount={onUnmount}
                            zoom={15}
                            onLoad={onMapLoad}>
                            {markerShow && temRoutes.map((route, i) => (
                                <><Marker
                                    key={i}
                                    position={{lat:temRoutes[i].latitude,lng:temRoutes[i].longitude}}
                                    icon={{
                                        url: arrowMarker,
                                        scaledSize: {width: 40, height: 40},
                                    }}
                                    animation={4}
                                    title={`${i+1}`}>
                                    {infoShow&&<InfoWindow
                                        key={i}
                                        position={temRoutes[bestWay[i]]}
                                    ><div><h6>{i+1}</h6></div></InfoWindow>}
                                </Marker>
                                </>
                            ))}
                            <Marker
                                position={center}
                                icon={{
                                    url: homeIcon,
                                    scaledSize: {width: 40, height: 40},
                                }}
                                title={'집'}
                                animation={2}
                            />
                            {infoShow &&
                            <Polyline
                                path={paths}
                                visible={lineShow}
                                options={{
                                    strokeColor: "#053c55",
                                    strokeOpacity: 0,
                                    strokeWeight: 3,
                                    icons: [
                                        {
                                            icon:
                                                dottedLine,
                                            // {path:window.google.maps.SymbolPath.FORWARD_OPEN_ARROW},//화살표
                                            //strokeOpacity 값 필요, repeat 픽셀 늘려야 함
                                            offset: "0",
                                            repeat: "20px"
                                        }
                                    ]
                                }}
                            />}
                        </GoogleMap>
                    </LoadScript>
                </div>
            </td>
                <td>
                    <div className="second_td">
                        <div className={"route_input"}>

                            <button onClick={e=>{
                                e.preventDefault();
                                getBestSeq(homePosit,temRoutes);}}>거리계산</button>
                            <button onClick={e=>{
                                e.preventDefault();
                                    makePath();
                            }}>getway</button>
                            <button onClick={e=>{
                                e.preventDefault();
                                setInfoShow(true);
                            }}>showPath</button>
                            <p>가장빠른 장보기 경로 찾기</p>
                            <ListGroup>
                                <ListGroup.Item><h6>출발:&nbsp;{myLoca}</h6></ListGroup.Item>
                                {temRoutes[0] &&
                                <ListGroup.Item>
                                    <h6>&#62;&#62;1번 경유지&#09;{temRoutes[0].storeName}&#09;{temRoutes[0].address}</h6>
                                </ListGroup.Item>}
                                {temRoutes[1] &&
                                <ListGroup.Item>
                                    <h6>&#62;&#62;2번 경유지&#09;{temRoutes[1].storeName}</h6>
                                </ListGroup.Item>}
                                {temRoutes[2] &&
                                <ListGroup.Item>
                                    <h6>&#62;&#62;3번 경유지&#09;{temRoutes[2].storeName}</h6>
                                </ListGroup.Item>}
                                <ListGroup.Item><h6>도착:&nbsp;{myLoca}</h6></ListGroup.Item>
                            </ListGroup>
                            <div className={'route_box'}>
                                {temRoutes.length<3 &&
                                <table className={'route_table'}>
                                    <tr><td><button className={'addB'}>+</button></td>
                                        <td><text className={'storeNameBox'}>경로추가하기</text></td></tr>
                                </table>}
                            </div>
                            <div>
                                <input className={"searchB"} onChange={e=> {realTimeSearch(e);}}/>
                                <Button variant="success">검색</Button>
                            </div>

                            {inputValue && dropShow &&
                            <ListGroup className={"searchB"}>
                                {shortSearched[0] &&<ListGroup.Item onClick={e=>{selectRoute(shortSearched[0])}}> {shortSearched[0].storeName} </ListGroup.Item>}
                                {shortSearched[1] && <ListGroup.Item onClick={e=>{selectRoute(shortSearched[1])}}> {shortSearched[1].storeName} </ListGroup.Item>}
                                {shortSearched[2] && <ListGroup.Item onClick={e=>{selectRoute(shortSearched[2])}}> {shortSearched[2].storeName} </ListGroup.Item>}
                            </ListGroup>
                            }
                        </div>
                    </div>
                </td></tr>
        </table>
    </>)
}

export default FindBestRoute;