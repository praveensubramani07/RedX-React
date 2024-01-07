import { GoogleLogin } from '@react-oauth/google';
import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';  // Correct import statement
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import '../stylesheet/login.css';

function Login() {
  const [userEmail, setUserEmail] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const cookies = new Cookies();

  useEffect(() => {
    // Check for the existence of the cookie
    const userEmailFromCookie = cookies.get('userEmail');
    if (userEmailFromCookie) {
      setUserEmail(userEmailFromCookie);
    }
  }, []);

  useEffect(() => {
    // Redirect if user email is available in the cookie
    if (userEmail) {
      const fetchData = async () => {
        try {
          const apiResponse = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail,
            }),
          });

          const responseData = await apiResponse.json();
          setUserType(responseData);

          if (responseData.added || responseData.existingUser) {
            // Redirect to /findCommunities if added is true, or / if existingUser is true
            navigate(responseData.added ? '/findCommunities' : '/');
            // Set the cookie
            setCookieHandler(userEmail);
          }
        } catch (error) {
          console.error('Error posting data', error);
        }
      };

      fetchData();
    }
  }, [userEmail, navigate]);

  const setCookieHandler = (userEmail) => {
    try {
      cookies.set('userEmail', userEmail, { path: '/' });
      console.log('Setting cookie');
    } catch (error) {
      console.error('Error setting cookie', error);
    }
  };

  return (
    <>
      {!userEmail && (
        <div className="google">
          <p className="login-p">Signup with Google to access the features</p>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              try {
                const decoded = jwtDecode(credentialResponse.credential);
                setUserEmail(decoded.email);
              } catch (error) {
                console.error('Error decoding JWT', error);
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
          />
        </div>
      )}
      {userType && (
        <>
          {userType.added && <p>New user</p>}
          {/* You can add additional UI elements based on userType if needed */}
        </>
      )}
    </>
  );
}

export default Login;
