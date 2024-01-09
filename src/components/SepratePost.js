import React, { useState, useEffect } from 'react';
import { Link, json, useParams } from 'react-router-dom';
import upvoteOffImage from '../images/upvote-off.png';
import downvoteOffImage from '../images/downvote-off.png';
import onUpvoteOffImage from '../images/upvote-on.png';
import onDownVoteOfImage from '../images/downvote-on.png';
import '../stylesheet/post.css';
import Navbar from './Navbar';
import { Cookies } from 'react-cookie';
import NavBar from './Navbar';
import Comment from './Comment';
import  url from './config';

export default function Post() {
  const [isposts, setposts] = useState([]);
  const { id } = useParams();
  const newid = parseInt(id, 10);
  const cookie = new Cookies();
  const user_id = cookie.get('userEmail');
  const post_id=newid;
  const [vote, setVote] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}getPostDetailsWithUserAndCommunity?post_id=${newid}&user_id=${user_id}`);
      const data = await response.json();
      setposts(data);
      
      console.log('from seprate post', data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const postVote = async (voteAction) => {
    try {
      console.log("postvote", voteAction, newid);
      const response = await fetch(`${url}vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, post_id, voteAction }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Vote successful:', data);
        
        // Fetch data after the vote is submitted
        fetchData();
      } else {
        console.error('Vote failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpvoteClick = () => {
    postVote('up');
  };

  const handleDownvote = () => {
    postVote('down');
  };

  useEffect(() => {
  if (id) {
    fetchData();
    console.log('useffect trigered')
  }
}, [id]);

  

  return (
    <>
    <NavBar/>
    {isposts.map((item) => (
    <div key={item.id}>
        <div className='cont-parent' >


        

          <div className='com-det'>

          <img className='com-dp' src={item.community_dp} />
          <Link to={`/community/${item.community_id}`} className='community'  style={{ textDecoration: 'none',marginLeft:5 }}>
                {item.community_name}
              </Link>
          

          </div>
          <p className='posted-by'>{item.user_name}</p>

          <p className='post-tittle'>{item.title}</p>

            
          {item.image.length > 1 && (
              <img className='post-image' src={item.image} alt="Post Image" />
            )}            

          
            <p className='post-description'>{item.description}</p>
        
          <div className='vote-cont'>
            <img
              className='up-off'
              onClick={handleUpvoteClick}
              src={item.vote_status === 'up' ? onUpvoteOffImage : upvoteOffImage}
              alt='Upvote'
            />
            <p>{item.upvote}</p>
            <img
              className='down-off'
              onClick={handleDownvote}
              src={item.vote_status === 'down' ? onDownVoteOfImage : downvoteOffImage}
              alt='Downvote'
            />
            <p>{item.downvote}</p>
          </div>
        </div>


        <Comment key={item.id} id={item.id}/>
        </div>

    ))}

  </>
      
  );
}
