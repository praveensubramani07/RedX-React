import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateCommunity from './components/CreateCommunity';
import Community from './components/Community';
import CreatePost from './components/CreatePost';
import Login from './components/Login';
import Home from './components/Home';
import SepratePost from "./components/SepratePost"
import { GoogleOAuthProvider } from '@react-oauth/google';
import FindCom from './components/FindCom';
import Profile from './components/Profile';




function App() {
  return (
    <GoogleOAuthProvider clientId='1078991654198-0p1gob6ab4r50iaolhqsino9hvlr4d3t.apps.googleusercontent.com'>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/createCommunity' element={<CreateCommunity/>}/>
        <Route path='/community/:id' element={<Community/>}/>
        <Route path='/createPost/:com_id' element={<CreatePost/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/post/:id' element={<SepratePost/>}/>
        <Route path='/findCommunities' element={<FindCom/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>

  );
}

export default App;