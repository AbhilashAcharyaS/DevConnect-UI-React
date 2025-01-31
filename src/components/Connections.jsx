import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <div className="min-h-[83vh]">
        <h1 className="text-center text-2xl mt-20">No Connections!</h1>
      </div>
    );

  return (
    <div className="text-center my-10 min-h-[60vh]">
      <h1 className="text-bold text-3xl mb-8">Connections</h1>

      {connections.map((conn) => {
        const {
          _id,
          firstName,
          lastName,
          photoUrl,
          about,
          skills,
          age,
          gender,
        } = conn;
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
                <p className="">{about}</p>
                {age && <p>{age }{", "}{gender}</p>}
              </div>
              <div className="w-1/4 my-10">
              <Link to={"/chat/"+_id} className="mx-auto">
               <button className="p-4 bg-success rounded-xl mt-">Chat</button>
               </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
