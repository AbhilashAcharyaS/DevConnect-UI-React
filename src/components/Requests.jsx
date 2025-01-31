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
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest= async(_id)=>{
    try {
        const res=await axios.post(BASE_URL+"/request/review/accepted/"+_id,{},{withCredentials:true});
        dispatch(removeOneRequest(_id))
        
    } catch (error) {
        console.log(error);     
    }
  }


  const rejectRequest= async(_id)=>{
    try {
        const res=await axios.post(BASE_URL+"/request/review/rejected/"+_id,{},{withCredentials:true});
        dispatch(removeOneRequest(_id));        
    } catch (error) {
        console.log(error);     
    }
  }

  useEffect(() => {
    getRequests();
  }, []);

  if (requests == null || requests.length === 0)
    return (
      <h1 className="text-2xl text-center my-10 min-h-[66vh]">
        No requests as of now!
      </h1>
    );

  return (
    <div className="text-center my-10 min-h-[66vh]">
      <h1 className="text-bold text-3xl mb-8">Connection Requests</h1>

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
            className="flex justify-between m-4 bg-base-300 border border-slate-600 rounded-xl w-10/12 md:w-3/5 mx-auto"
          >
            <div className="flex flex-row card-body p-1 md:p-4">
              <div className="w-1/4 mx-auto">
                <img alt="user" src={photoUrl} className="rounded-full w-20 h-20 md:w-40 md:h-40 object-contain p-2 my-4 md:my-0" />
              </div>
              <div className="w-2/4 text-left my-4">
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
              <div className="p-2 m-2 w-1/4 flex flex-col">
                <button className="btn btn-success px-4 mb-2 md:mb-4" onClick={()=>acceptRequest(req._id)}>Accept</button>
                <button className="btn btn-error px-4"onClick={()=>rejectRequest(req._id)}>Reject</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
