import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeOneUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch= useDispatch()
  const { _id, firstName, lastName, photoUrl, about, skills, age, gender } = user;

  const handleSendRequest= async(status,userId)=>{
    try {
      const res= await axios.post(BASE_URL+"/request/send/"+status+"/"+userId,{},{withCredentials:true});
      dispatch(removeOneUserFromFeed(userId));
    } catch (error) {
      console.log(error);     
    }
  }

  return (
    <div>
      <div className="card bg-base-300 w-76 md:w-96 shadow-xl my-8 border border-slate-600">
        <figure>
          <img src={photoUrl} alt="user photo" className="w-40 h-60 object-contain my-2" />
        </figure>
        <div className="card-body">
          {lastName && (
            <h2 className="card-title">{firstName + " " + lastName}</h2>
          )}
          {!lastName && <h2 className="card-title">{firstName}</h2>}
          <div>
            {age && <span className="inline">{age}</span>}
            {gender && <span className="inline">{", " + gender}</span>}
          </div>
          <p>{about}</p>
          <p>{skills}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-success" onClick={()=>handleSendRequest("interested",_id)}>Connect</button>
            <button className="btn btn-secondary" onClick={()=>handleSendRequest("ignored",_id)}>Ignore</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
