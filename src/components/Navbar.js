import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../stylesheet/navbar.css';
import { Cookies } from 'react-cookie';


export default function NavBar() {
  const [searchAct, setSearchAct] = useState(false);
  const [menuAct, setMenuAct] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const cookies = new Cookies();
  const userEmail = cookies.get('userEmail');
    
  if(userEmail==null || userEmail== undefined){
    navigate(`../login`);

  }


    const handleLogout = () => {
      const cookies = new Cookies();
      // Remove the user email cookie or any other relevant cookies
      cookies.remove('userEmail');
      setMenuAct(false);
      navigate('/');

    };
  

  function handleSearchClick() {
    setSearchAct((prevSearchAct) => !prevSearchAct);
  }

  const handleKeyword = (event) => {
    setKeyword(event.target.value);
  };

  function handleMenu() {
    setMenuAct((prevMenuAct) => !prevMenuAct);
  }

  useEffect(() => {


        const fetchCommunities = async () => {
          try {
            const response = await fetch(`http://localhost:4000/api/joinedCommunities?email=${userEmail}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch communities: ${response.statusText}`);
            }
            const data = await response.json();
            setCommunities(data);
            setLoadingSubcategories(false);
            console.log(communities);
          } catch (error) {
            console.error('Error fetching communities:', error);
            setLoadingSubcategories(false); // Set loading to false in case of an error
          }
        };
      
        fetchCommunities();
      }, [userEmail]);
      

  const fetchDataForCategory = (categoryName) => {
    // Implement your logic to fetch data for the specified category
    // For example: make an API call, update state, etc.
    console.log(`Fetching data for category: ${categoryName}`);
  };

  const renderSubCategories = () => {
    if (loadingSubcategories) {
      return (
        <div className="loading-sub">
          {/* ... (loading skeleton or spinner) */}
          <div className="sub-seleton"></div>
          <br></br>
          <div className="sub-seleton"></div>
        </div>
      );
    }

    if (Array.isArray(communities) && communities.length > 0) {
      return communities.map((community) => (
        <div
          key={community.id}
          className="menu-item"
          onClick={() => handleSubCategoryClick(community.id)}
        >
          <img src={community.dp} />
          <p>{community.community}</p>
        </div>
      ));
    } else {
      return <p style={{paddingLeft:20}}>No Joined Communities.</p>;
    }
  };

  const handleSubCategoryClick = (categoryName) => {
    // Navigate to the new category route
    navigate(`/community/${categoryName}`);

    // Fetch data for the new category
    fetchDataForCategory(categoryName);
  };

  return (
    <>
      <div className="nav">
    
          <>
                 <div className="ham" onClick={handleMenu}>
                {menuAct ? (
                  <img src="/assets/close.png" alt="Menu" />
                ) : (
                  <img src="/assets/menu.png" alt="Menu" />
                )}
              </div>

            <Link to={'../'} style={{textDecoration:'none'}}>
            <div className="logo" ><h1>RedX</h1></div>
            </Link>
            <div className="left">
            {
            (userEmail==null || userEmail==undefined)
            ?
            <Link to={'../login'}><button className='join'>Login</button></Link>
            :
            <>
            <Link to={'../findCommunities'}>
            <div className="search" ><img src="/assets/search.png" alt="Sort" /></div>
            </Link>
            <div className="plus" onClick={handleMenu}><img src="/assets/plus.png" alt="Profile" /></div>
            <Link to={'../profile'}>
            <div className="profile"><img src="/assets/user.png" alt="Profile" /></div>
            </Link>
            </>
            }
            </div>
            
          </>

      </div>

      {menuAct && (
        <div className='menu'>
          <Link to={'../createCommunity'} style={{textDecoration:'none'}}>
          <div className='create-post-com'>
            <img src="/assets/plus.png"/>
            <p>Create a Community</p>
          </div>
          </Link>
          <Link to={'../findCommunities'} style={{textDecoration:'none'}}>
          <div className='create-post-com'>
            <img src="/assets/plus.png"/>
            <p>Create a Post</p>
          </div>
          </Link>
          {renderSubCategories()}
          <ul>
            <li><button className='logout' onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      )}
    </>
  );

}