import React, { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import UserCard from './UserCard'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'

const Feed = () => {
  const dispatch= useDispatch();
  const feed= useSelector(store=>store.feed)

  const getFeed= async()=>{
    try {
      const res= await axios.get(BASE_URL+"/feed",{withCredentials:true});
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    // if(feed) return;
    getFeed()
  }, [])

  if(feed?.length===0) return (<div><h2 className='text-center text-2xl my-10 min-h-[380px]'>Nothing to show!</h2></div>)

  return (
    feed && (
    <div>
        <div className="flex justify-center items-center min-h-[460px]">
        <UserCard user={feed[1]} />
        </div>
    </div>)
  )
}

export default Feed