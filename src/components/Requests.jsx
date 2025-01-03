import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeOneRequest } from "../utils/requestSlice";
import UserCard from "./UserCard";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest= async(_id)=>{
    try {
        const res=await axios.post(BASE_URL+"/request/review/accepted/"+_id,{},{withCredentials:true});
        console.log(res);
        dispatch(removeOneRequest(_id))
        
    } catch (error) {
        console.log(error);     
    }
  }


  const rejectRequest= async(_id)=>{
    try {
        const res=await axios.post(BASE_URL+"/request/review/rejected/"+_id,{},{withCredentials:true});
        console.log(res);
        
    } catch (error) {
        console.log(error);     
    }
  }

  useEffect(() => {
    getRequests();
  }, []);

  if (requests == null || requests.length === 0)
    return (
      <h1 className="text-2xl text-center my-10 min-h-[380px]">
        No requests as of now!
      </h1>
    );

  return (
    <div className="text-center my-10 min-h-[380px]">
      <h1 className="text-bold text-3xl text-white mb-8">Connections</h1>

      {requests.map((req) => {
        const {
          _id,
          firstName,
          lastName,
          photoUrl,
          about,
          skills,
          age,
          gender,
        } = req.fromUserId;
        return (
          <div
            key={_id}
            className="flex justify-between m-4 bg-base-300 border border-slate-600 rounded-xl w-1/2 mx-auto"
          >
            <div className="flex justify-between">
              <div className="w-1/3 p-2">
                <img alt="user" src={photoUrl} className="rounded-full" />
              </div>
              <div className="w-2/3 p-4 text-left">
                <h2 className="text-lg font-bold">
                  {firstName + " "} {lastName}
                </h2>
                <p>{about}</p>
                {age && (
                  <p>
                    {age}
                    {", "}
                    {gender}
                  </p>
                )}
              </div>
              <div className="p-2 m-2">
                <button className="btn btn-success m-1" onClick={()=>acceptRequest(req._id)}>Accept</button>
                <button className="btn btn-error"onClick={()=>rejectRequest(req._id)}>Reject</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
