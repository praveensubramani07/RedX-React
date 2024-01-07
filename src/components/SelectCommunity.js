import React from 'react'
import { useState } from 'react'
export default function SelectCommunity() {
    const [searchKey,setSearchKey]=useState("");
    const handleChange=(event)=>{
        setSearchKey(event.target.value)
    }


    /////sending search key to api
    const handleSearch=()=>{

    }
  return (
    <>
    <div className='cont'>
        <input type='text' placeholder='Search Community..' value={searchKey} onChange={handleChange}/>
        <button onClick={handleSearch}>Search</button>
    </div>
    
    </>
  )
}
