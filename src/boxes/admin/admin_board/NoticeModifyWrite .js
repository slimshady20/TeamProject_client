import React,{ useState,useEffect } from 'react';
import {Form, Col, Button, Row} from 'react-bootstrap'
import {Link} from "react-router-dom";
import ReactQuill from "react-quill";
import './AdminBoard.css'
import axios from 'axios'

const NoticeModifyWrite = () => {
    const [contents, setContents] = useState("");
    const [postTitle,setPostTitle] = useState("");
    const [category,setCategory] = useState("");
    const [postId,setPostId] = useState("");
    const [accountDetail] = useState(
      JSON.parse(sessionStorage.getItem("accountDetail"))
    );
    const [notice] = useState(
        JSON.parse(sessionStorage.getItem("notice"))
    )

    const [id,setId] = useState("");

    useEffect(()=>{
        setId(accountDetail.id);
        setContents(notice.contents);
        setPostTitle(notice.postTitle);
        setCategory(notice.category)
        setPostId(notice.postId)
    },[accountDetail,notice])



    const handleQuill = value =>{
        setContents(value)
    }

const newNotice = e =>{
    e.preventDefault()
    const notice = {
        postId:postId,
        userId:accountDetail.id,
        category:category,
        postTitle:postTitle,
        contents:contents
    }
    if(category ==="" || postTitle ==="" || contents ==="" || category==="카테고리" ){
        alert('입력창을 다채워주세요')
    }else{
        axios
        .patch(`http://localhost:8080/posts/update/${postId}`, notice)
        .then((res)=>{
                console.log(res.data)
                window.location.href="/admin/notice"
        })
        .catch((err)=>{
            throw err;
        })
    }
   

    
}


    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }], [{ 'font': [] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],[{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image'],

            ['clean'],

        ],
        clipboard:{
            matchVisual: false,
          },
    }

       const formats = [
            'header', 'font',
            'bold', 'italic', 'underline', 'strike', 'blockquote','align',
           'color', 'background',
           'list', 'bullet',
            'link', 'image',
        ]

    return (
        <>
            <div className="content-title">
                <h2 className="menu-h2"> - 공지사항 작성</h2>
            </div>
            <Form>
                <Form.Group as={Row} >
                    <Form.Label column sm={1}>
                        카테고리
                    </Form.Label>
                    <Col sm={2}>
                        <Form.Control as="select"
                        value={category}
                        onChange={e=>setCategory(e.target.value)} >
                            <option value="카테고리" selected>카테고리</option>
                            <option value="지역화폐">지역화폐</option>
                            <option value="사이트">사이트</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} >
                    <Form.Label column sm={1} style={{textAlign : 'center'}}>
                        제목
                    </Form.Label>
                    <Col>
                        <Form.Control onChange={e=>setPostTitle(e.target.value)} value={postTitle} as="input"/>
                    </Col>
                </Form.Group>
                <ReactQuill theme="snow"
                            value={contents} onChange={handleQuill}
                            modules={modules}
                            formats={formats}
                            style={{height:'400px'}}
                />
               {/* <Form.Label>첨부 링크</Form.Label>
                <Form.Control as="input"/>
                <Form.File label="파일 첨부"/>*/}
            </Form>
            <br/>
            <div id="quill-button-center">
                <Link to="/admin/notice">
                    <Button variant="primary" onClick={newNotice} type="submit">확인</Button>{' '}
                    <Button variant="secondary" type="button">취소</Button>{' '}
                </Link>
            </div>

        </>
    );
};

export default NoticeModifyWrite;