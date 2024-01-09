import React, { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie';
import send from '../images/send.png'
import '../stylesheet/comment.css'
import url from './config';


export default function Comment({id}) {
    const [comment,setComment]=useState("");
    const cookie=new Cookies()
    const user_id=cookie.get('userEmail');
    const newid=id;
    const [isData,setData]=useState([]);

    const commentData={
        post_id:newid,
        comment:comment,
        user_id:user_id,
      }
      
      const postComments=async ()=>{
        try{
          const response= await fetch(`${url}comments`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify(commentData)
          })
          const data=await response.json()
          console.log(data)
          setComment('')
          fetchcomments();
        }
        catch(error){
          console.log(error)
        }
      }
      const isCommentValid = () => {
        // Check if the comment contains only spaces
        return !/^ *$/.test(comment);
      };
///fetch comments
const fetchcomments=async()=>{
    try{
    const response=fetch(`${url}getComment`,{
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({post_id:newid}),
        

    })
    const data=await (await response).json();
        console.log(data)
        setData(data);
}
    catch(error){
        console.log(error)
    }
}
useEffect(()=>{
    fetchcomments()
},[id])
  return (
    <>
    <div className='comment-parent'>
    {isData.map((item)=>
    <div className='comment-div' key={item.id}>
    <p className='cmt-name'>{item.user_id}</p>
    <p className='cmt-comment'>{item.comment}</p>
</div>
    
    )}
    
       <div>
      <input className='cmt-input'
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)} // Update the comment value in the state
        placeholder="Type your comment"
      />
      <button className="cmt-button"onClick={postComments} disabled={!isCommentValid()}>Post</button>
    </div>
    </div>
    </>
  )
}
