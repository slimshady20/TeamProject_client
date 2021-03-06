import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import "./Recommendation.css";

function Recommendation() {
  const [accountDetail] = useState(
    JSON.parse(sessionStorage.getItem("accountDetail") || "{}")
  );
  const [latLng] = useState(
    JSON.parse(sessionStorage.getItem("LatLng") || "{}")
  );
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [id, setId] = useState("");
  const [userBased, setUserBased] = useState([]);
  const [itemBased, setItemBased] = useState([]);
  const [bestStore, setBestStore] = useState([]);
  const [userWarningMsg, setUserWarningMsg] = useState("");
  const [itemWarningMsg, setItemWarningMsg] = useState("");

  useEffect(
    () => {
      setId(accountDetail.id);
      setLat(latLng.latitude);
      setLng(latLng.longitude);
    },
    [accountDetail],
    [latLng]
  );

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/recommends/individualUser/${id}`)
        .then((res) => {
          console.log("소통 성공");
          console.log(res.data.userBased);
          if (res.data.userBased) {
            setUserBased(res.data.userBased);
          } else if (res.data.noUserBased) {
            setUserWarningMsg(res.data.noUserBased);
          }
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/recommends/individualItem/${id}`)
        .then((res) => {
          console.log("소통 성공");
          if (res.data.itemBased) {
            setItemBased(res.data.itemBased);
          } else if (res.data.noItemBased) {
            setItemWarningMsg(res.data.noItemBased);
          }
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      console.log("가나다라마" + lat + lng);
      axios
        .get(`http://localhost:8080/recommends/best/${lat}/${lng}`)
        .then((res) => {
          console.log("소통 성공");
          setBestStore(res.data.bestStore);
          console.log(res.data.bestStore);
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [id]);

  return (
    <>
      <h2>simin님을 위한 우리 동네 추천 가맹점</h2>
      <br />

      <h4>내 주변 인기 가맹점</h4>
      <div className="scrollContainer">
        {bestStore.map((store, i) => (
          <Card className="cardItem" key={i}>
            <Card.Img id="card-image" variant="top" src={store.imgUrl} />
            <Card.Body>
              <Card.Title>{store.storeName}</Card.Title>
              <Card.Text>{store.address}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                {store.mainCode}/{store.storeType}
              </small>
            </Card.Footer>
          </Card>
        ))}
      </div>
      <br />
      <br />

      <h4>회원님과 유사한 회원들이 좋아하는 가맹점</h4>
      {(!userWarningMsg || !userBased) && (
        <div>
          {" "}
          굴러간다 굴렁쇠
          <Spinner animation="border" variant="primary" />
          <Spinner animation="border" variant="secondary" />
          <Spinner animation="border" variant="success" />
          <Spinner animation="border" variant="danger" />
          <Spinner animation="border" variant="warning" />
          <Spinner animation="border" variant="info" />
        </div>
      )}

      {!userWarningMsg && (
        <div className="scrollContainer">
          {userBased.map((store, i) => (
            <Card className="cardItem" key={i}>
              <Card.Img id="card-image" variant="top" src={store.imgUrl} />
              <Card.Body>
                <Card.Title id="card-title">{store.storeName}</Card.Title>
                <Card.Text>{store.address}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {store.mainCode}/{store.storeType}
                </small>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
      {userWarningMsg && (
        <div className="scrollContainer">
          <h4>{userWarningMsg}</h4>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />

      <h4>즐겨찾기한 #순남시래기와 유사한 추천 가맹점</h4>
      {(!itemWarningMsg || !itemBased) && (
        <div>
          {" "}
          빅 데 이 터 가 동 중 삐 용 삐 용
          <Spinner animation="border" variant="primary" />
          <Spinner animation="border" variant="secondary" />
          <Spinner animation="border" variant="success" />
          <Spinner animation="border" variant="danger" />
          <Spinner animation="border" variant="warning" />
          <Spinner animation="border" variant="info" />
        </div>
      )}

      {!itemWarningMsg && (
        <div className="scrollContainer">
          {itemBased.map((store, i) => (
            <Card className="cardItem" key={i}>
              <Card.Img id="card-image" variant="top" src={store.imgUrl} />
              <Card.Body>
                <Card.Title id="card-title">{store.storeName}</Card.Title>
                <Card.Text>{store.address}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {store.mainCode}/{store.storeType}
                </small>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
      {itemWarningMsg && (
        <div className="scrollContainer">
          <h4>{itemWarningMsg}</h4>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />

      <h4>즐겨찾기한 #순남시래기와 유사한 추천 가맹점</h4>
      {(!itemWarningMsg || !itemBased) && (
        <div>
          {" "}
          빅 데 이 터 가 동 중 삐 용 삐 용
          <Spinner animation="border" variant="primary" />
          <Spinner animation="border" variant="secondary" />
          <Spinner animation="border" variant="success" />
          <Spinner animation="border" variant="danger" />
          <Spinner animation="border" variant="warning" />
          <Spinner animation="border" variant="info" />
        </div>
      )}

      {!itemWarningMsg && (
        <div className="scrollContainer">
          {itemBased.map((store, i) => (
            <Card className="cardItem" key={i}>
              <Card.Img id="card-image" variant="top" src={store.imgUrl} />
              <Card.Body>
                <Card.Title id="card-title">{store.storeName}</Card.Title>
                <Card.Text>{store.address}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {store.mainCode}/{store.storeType}
                </small>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
      {itemWarningMsg && (
        <div className="scrollContainer">
          <h4>{itemWarningMsg}</h4>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />

      <h4>나와 같은 성별, 연령대가 좋아하는 어쩌고 업종 </h4>
      {(!itemWarningMsg || !itemBased) && (
        <div>
          {" "}
          빅 데 이 터 가 동 중 삐 용 삐 용
          <Spinner animation="border" variant="primary" />
          <Spinner animation="border" variant="secondary" />
          <Spinner animation="border" variant="success" />
          <Spinner animation="border" variant="danger" />
          <Spinner animation="border" variant="warning" />
          <Spinner animation="border" variant="info" />
        </div>
      )}

      {!itemWarningMsg && (
        <div className="scrollContainer">
          {itemBased.map((store, i) => (
            <Card className="cardItem" key={i}>
              <Card.Img id="card-image" variant="top" src={store.imgUrl} />
              <Card.Body>
                <Card.Title id="card-title">{store.storeName}</Card.Title>
                <Card.Text>{store.address}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {store.mainCode}/{store.storeType}
                </small>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
      {itemWarningMsg && (
        <div className="scrollContainer">
          <h4>{itemWarningMsg}</h4>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />

      <h4>최근 즐겨찾기한 땡땡땡 가게와 같은 업종 가게</h4>
      {(!itemWarningMsg || !itemBased) && (
        <div>
          {" "}
          빅 데 이 터 가 동 중 삐 용 삐 용
          <Spinner animation="border" variant="primary" />
          <Spinner animation="border" variant="secondary" />
          <Spinner animation="border" variant="success" />
          <Spinner animation="border" variant="danger" />
          <Spinner animation="border" variant="warning" />
          <Spinner animation="border" variant="info" />
        </div>
      )}

      {!itemWarningMsg && (
        <div className="scrollContainer">
          {itemBased.map((store, i) => (
            <Card className="cardItem" key={i}>
              <Card.Img id="card-image" variant="top" src={store.imgUrl} />
              <Card.Body>
                <Card.Title id="card-title">{store.storeName}</Card.Title>
                <Card.Text>{store.address}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  {store.mainCode}/{store.storeType}
                </small>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
      {itemWarningMsg && (
        <div className="scrollContainer">
          <h4>{itemWarningMsg}</h4>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Recommendation;
