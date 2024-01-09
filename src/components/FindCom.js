import React, { useState, useEffect } from 'react';
import '../stylesheet/newuser.css';
import { Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import NavBar from './Navbar';
import url from './config';

const FindCom = () => {
  const [communities, setCommunities] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const cookies = new Cookies();
  const userEmail = cookies.get('userEmail');
  const [loading,setLoading]=useState(true);

  
  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}communities`);
      const data = await response.json();
      setCommunities(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  // Fetch communities based on search keyword
  const searchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}searchCom?keyword=${searchKeyword}`);
      const data = await response.json();
      setCommunities(data);
      setLoading(false);

    } catch (error) {
      console.error('Error searching communities:', error);
    }
  };

  // Handle join/leave community
  const handleJoinLeave = async (communityId) => {
    const user_id = userEmail; // Replace with the actual user ID
    try {
      const response = await fetch(`${url}comLogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, com_id: communityId }),
      });
      const data = await response.json();
      console.log('Join/Leave Response:', data);
      // Refresh communities after joining/leaving
      fetchCommunities();
    } catch (error) {
      console.error('Error joining/leaving community:', error);
    }
  };

  useEffect(() => {
    // Fetch all communities on component mount
    searchCommunities();
    //fetchCommunities();
  }, [searchKeyword]);

  return (
    <>
    <NavBar/>
      <div className='find-main'>
        {/* Search input */}
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search communities"
        />

        {/* List of communities */}
        <div className='comm'>
        <ul>
          {
          (communities.length>0)?
          communities.map((community) => (
                <li key={community.id}>
                <div className='cont-1'>
                <img src={community.dp}/>
                <span>{community.community}</span>

              </div>
              <div className='comm-2'>
              <Link to={`../createPost/${community.id}`}><button className='comm-btn'>Post Here</button></Link>
              <Link to={`../community/${community.id}`}><button className='comm-btn'>View</button></Link>
              </div>
            </li>
          ))
        :
        (loading ?
          <p>Loading..</p>
          :
          <p>Community not found</p>
          )
        }

        </ul>
        </div>
      </div>
    </>
  );
};

export default FindCom;
