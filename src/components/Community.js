import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import NavBar from './Navbar';
import upvoteOffImage from '../images/upvote-off.png';
import downvoteOffImage from '../images/downvote-off.png';
import '../stylesheet/post.css';
import onUpvoteOffImage from '../images/upvote-on.png';
import onDownVoteOfImage from '../images/downvote-on.png';
import Post from './Post';
import url from './config';

const Community = () => {
  const { id } = useParams();
  const [communityData, setCommunityData] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const userEmail = cookies.get('userEmail');
  const [membersCount,setMembersCount]=useState(null);
  const [allPost,setAllPost]=useState([]);
  const [allId,setAllId]=useState();
  if(userEmail==null || userEmail== undefined){
    navigate(`/login`);
  }
  
  const fetchCommunityData = () => {
    fetch(`${url}community/${id}`)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            // Community not found

          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } else {
          console.log(communityData);
          return response.json();
        }
      })
      .then(data => setCommunityData(data))
      .catch(error => console.error('API Error:', error));
  };

  const fetchUserStatus = () => {
    fetch(`${url}statusLog?user_id=${userEmail}&com_id=${id}`)
      .then(response => response.json())
      .then(data => setUserStatus(data))
      .catch(error => console.error(error));
  };

  const fetchMembersCount= () => {
    fetch(`${url}membersCount?com_id=${id}`)
      .then(response => response.json())
      .then(data => setMembersCount(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchCommunityData();
    fetchUserStatus();
    fetchMembersCount();
    console.log(communityData);
  }, [id, userEmail]);

  const handleJoinClick = () => {
    const apiUrl = `${url}comLogs`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userEmail, com_id: id }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Updated user status:', data);

        // Fetch updated user status after the click
        fetchUserStatus();
        fetchMembersCount();
      })
      .catch(error => console.error(error));
  };

  

  const handleCreatePostClick = () => {
    navigate(`/createPost/${id}`);
  };
///fetch all posts of a community
  const fetchDataOfCommunity=async()=>{
    try{
      const response=await fetch(`${url}communityPosts?com=${id}`);
      const data=await response.json();
      console.log("from all comunity post",data);
      setAllPost(data);
      
  
    }
      catch(error){
        console.log(error)
      }
  }
///handel votes 
const user_id=userEmail;










useEffect(()=>{
fetchDataOfCommunity();

},[id])

  if (!communityData || userStatus === null) {
    return (
    <>
    <NavBar/>
      <div className='loading-comm'>
        <div className='lo-c'>
        </div>
        <div className='lo-b'></div>
        <div className='lo-btn'></div>
        <div className='lo-btn'></div>
      </div>
    </>
    );
  }
  // Add this check for empty community data
  if (!communityData || communityData.length === 0) {
    return <div className='com-not-found'>
      <Link to={'/createCommunity'}>Create Community</Link>
      <p>This community is not found ,it may be deleted</p>
    </div>;
  }

  return (
    <>
    <NavBar/>
      <div className='community-header'>
        <div className='header-flex'>
          <div className='header-1'>
            <img src={communityData[0].dp} alt='dp' />
            <div className='title-count'>
              <p className='com-title'>{communityData[0].community}</p>
              {membersCount && <p className='count'>{membersCount.count} Members</p>}          </div>
            </div>
          <div className='header-2'>
            <button className='join' onClick={handleJoinClick}>
              {userStatus.joined ? 'Joined' : 'Join'}
            </button>
            <button className='create' onClick={handleCreatePostClick}>
              Create a Post
            </button>
          </div>
        </div>
      </div>
      <p className='posts-title'>Posts</p>
      {allPost.map((post) => (
        <Post key={post.id} post={post.id} />
      ))}
    </>
  );
};

export default Community;
