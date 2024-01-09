import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheet/community.css';
import { Cookies } from 'react-cookie';
import url from './config';


export default function CreateCommunity() {
  const navigate = useNavigate();

  const [communityName, setCommunityName] = useState('');
  const [dpFile, setDpFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCommunityNameChange = (e) => {
    setCommunityName(e.target.value);
  };

  const handleDpFileChange = (e) => {
    setDpFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    const cookies = new Cookies();
    const storeCookie = cookies.get('userEmail');
    formData.append('community', communityName);
    formData.append('admin', storeCookie); // Implement this function
    formData.append('dp', dpFile);

    try {
      const response = await fetch('https://redxproject.000webhostapp.com/api/community.php', {
        method: 'POST',
        body: formData,
      });
      
        console.log(',jfdht',response)
      if (response.ok) {
        console.log('insed if')
        const data = await response.json();
        console.log(data); // Handle the response from the server

        // Redirect to the new community page
        navigate(`/community/${data.insertId}`);
      } else {
        console.error('Failed to create community');
      }
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className='createcom-main'>
    <form onSubmit={handleSubmit}>
      <div className='form-cont'>
        
        <p className='note-cc'>Name of community and Profile cannot be changed</p>

          <p className='label-cc'>Community Name</p>
          <input type="text" value={communityName} onChange={handleCommunityNameChange} />
      
          <p className='label-cc'>Community Profile</p>
          <input type="file" accept="image/*" onChange={handleDpFileChange} />
        
          <button type="submit"  disabled={loading}>
          {loading ? 'Creating Community...' : 'Create Community'}
        </button>
      </div>
    </form>
    </div>
    </>
    
  );
}
