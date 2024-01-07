// Post.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import upvoteOffImage from '../images/upvote-off.png';
import downvoteOffImage from '../images/downvote-off.png';
import '../stylesheet/post.css';
import { Cookies } from 'react-cookie';
import onUpvoteOffImage from '../images/upvote-on.png';
import onDownVoteOfImage from '../images/downvote-on.png';

export default function Post({ post }) {
  const [postDetails, setPostDetails] = useState([]);
  const post_id = post;
  const cookie = new Cookies();
  const user_id = cookie.get('userEmail');

  const postVote = async (voteAction) => {
    try {
      const response = await fetch('http://localhost:4000/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, post_id, voteAction }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Vote successful:', data);
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

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/getPostDetailsWithUserAndCommunity?post_id=${post_id}&user_id=${user_id}`);
      const data = await response.json();
      setPostDetails(data);
      console.log('Post data:', data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [post_id]);

  return (
    <>
      {postDetails.map((item) => (
        <div key={item.description} className='cont-parent'>
          <Link to={`/post/${post_id}`} style={{ textDecoration: 'none', display: 'contents' }}>
            <div className='com-det'>
              <img className='com-dp' src={item.community_dp} alt='Community DP' />
              <span className='community' style={{ textDecoration: 'none' }}>
                {item.community_name}
              </span>
            </div>
            <p className='post-tittle'>{item.title}</p>
            {item.image.length > 1 && (
              <img className='post-image' src={item.image} alt="Post Image" />
            )}
            <p className='post-description'>{item.description}</p>
          </Link>
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
      ))}
    </>
  );
}
