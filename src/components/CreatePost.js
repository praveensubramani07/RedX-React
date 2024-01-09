import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from './Navbar';
import { Cookies } from 'react-cookie';


export default function CreatePost() {
  const navigate = useNavigate();
  const { com_id } = useParams(); // Get com_id from URL parameters
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
  
    const formData = new FormData();
    const cookies = new Cookies();
    const storeCookie = cookies.get('userEmail');
    formData.append('user_id', storeCookie); // Replace with the actual user ID
    formData.append('com_id', com_id); // Use com_id from URL
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', imageFile);
  
    try {
      const response = await fetch('https://redxproject.000webhostapp.com/api/post.php', {
        method: 'POST',
        body: formData,
      });
    
      if (response.ok) {
        const data = await response.json(); // Use json() to parse the response body
        console.log(data); // Handle the parsed data from the server
    
        // Now you can access specific properties in the 'data' object
        if (data && data.success) {
          // Post creation successful, handle accordingly
          console.log('Post created successfully');
          navigate(`/community/${com_id}`);
        } else {
          // Post creation failed, handle accordingly
          console.error('Failed to create post:', data.error);
          alert('Failed to create post. Please try again.');
        }
      } else {
        console.error('Failed to create post');
        alert('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Nav/>
      <div className='createcom-main'>
        <form onSubmit={handleSubmit}>
          <div className='form-cont'>
            
            <p className='note-cc'>Title and Description of the post can be edited later</p>
    
            <p className='label-cc'>Title:</p>
            <input type="text" value={title} onChange={handleTitleChange} />
    
            <p className='label-cc'>Description:</p>
            <textarea value={description} onChange={handleDescriptionChange} />
    
            <p className='label-cc'>Image:</p>
            <input type="file" accept="image/*" onChange={handleImageFileChange} />
            
            <button type="submit" disabled={loading}>
              {loading ? 'Creating Post...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
