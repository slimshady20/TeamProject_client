import React,{useState,useEffect} from 'react';
import {Table,Button} from 'react-bootstrap'
import {useSelector} from 'react-redux'
import './AdminBoard.css'
import axios from 'axios';




const NoticeDetail = ({match}) => {
    
    const result = useSelector(state=>state.postListReducer,{});
    const [post,setPost] = useState({});
   
   useEffect(()=>{
       console.log(`${match.params.postId}`)
    axios
        .get(`http://localhost:8080/posts/post/${match.params.postId}`)
        .then((res)=>{
                console.log(`axios`)
                console.log(res.data)
                 setPost(res.data)
                 console.log(result)
        })
        .catch((err)=>{
            throw err;
        })
   },[])

   const modifyNotice = () =>{
       window.location.href="/admin/notice-modify"
   }

   const noticeList = () =>{
       window.location.href="/admin/notice"
   }

   const deleteNotice = e =>{
        e.preventDefault()
       
        axios
        .delete(`http://localhost:8080/posts/delete/`)
        .then((res)=>{
            window.location.href="/admin/notice"
        })
        .catch((err)=>{
            throw err;
        })
   }

    return (
        <>
            <div className="content-title">
    <h2 className="menu-h2"> - 공지사항</h2>
            </div>
            <Table responsive bordered>
                <thead style={{textAlign:'center'}}>
                <tr>
                    <th>카테고리 - {post.postTitle}</th>
                    <th>제목 - {post.postTitle}</th>
                    <th>작성일 - {post.regDate}</th>
                    
                </tr>
                </thead>
                <tbody>
                <tr>
                 <td colSpan={4}> {post.contents}</td>

                </tr>
            

                </tbody>
            </Table>
            <div id="button-right">
            <Button variant="outline-dark" onClick={modifyNotice}>수정</Button>{' '}
            <Button variant="outline-dark" onClick={deleteNotice}>삭제</Button>{' '}
            <Button variant="outline-dark " onClick={noticeList}>목록</Button>
            </div>
            </>
    );
};

export default NoticeDetail;