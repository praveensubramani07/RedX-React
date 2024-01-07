import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import NavBar from './Navbar';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const userEmail = cookies.get('userEmail');
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    // Fetch user data based on email when component mounts
    fetch(`http://localhost:4000/api/users?email=${userEmail}`)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error('Error fetching user data:', error));
  }, [userEmail]);

  const handleUpdateUsername = () => {
    // Update the username in the backend
    fetch('http://localhost:4000/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail, newUsername }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Update the local state with the new username
        setUserData((prevUserData) => ({ ...prevUserData, username: newUsername }));
      })
      .catch((error) => console.error('Error updating username:', error));
  };

  return (
    <>
      <NavBar />
      {userData ? (
        <div className='user-det'> 
          <p className='pro-p'>Hello, <span className='pro-user'>{userData.username!="" ?userData.username: <p>Redx User</p>}</span></p>
          <p className='pro-p'>Logged in with {userData.email}</p>

          <div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)
              }
              placeholder="Edit your username"

            />
            <button onClick={handleUpdateUsername}>Save</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
