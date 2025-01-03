import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

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
      <div className="min-h-[460px]">
        <h1 className="text-center text-2xl mt-20">No Connections!</h1>
      </div>
    );

  return (
    <div className="text-center my-10 min-h-[380px]">
      <h1 className="text-bold text-3xl text-white mb-8">Connections</h1>

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
            className="flex justify-between m-4 bg-base-300 border border-slate-600 rounded-xl w-1/3 mx-auto"
          >
            <div className="flex justify-between">
              <img alt="user" src={photoUrl} className="w-1/3 rounded-full p-2" />
              <div className="w-2/3 p-4 text-left">
                <h2 className="text-lg font-bold">
                  {firstName + " "} {lastName}
                </h2>
                <p>{about}</p>
                {age && <p>{age }{", "}{gender}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
