// Home.js
import React, { useState, useEffect } from 'react';
import NavBar from './Navbar';
import Post from './Post';
import { Cookies } from 'react-cookie';

export default function Home() {
  const cookie=new Cookies();
  const userId=cookie.get('userEmail')
  const [dataSets, getDataSets] = useState([]);
  const url = `http://localhost:4000/api/feed/${userId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const allData = await response.json();
        getDataSets(allData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('from home',dataSets); // Log the state after it has been updated
  }, [dataSets]);

  return (
    <>
      <NavBar />
      {Array.isArray(dataSets) && dataSets.map((post) => (
  <Post key={post.id} post={post.id} />
))}

    </>
  );
  
}
