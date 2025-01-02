import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, about, skills, age, gender } = user;

  return (
    <div >
      <div className="card bg-base-300 w-96 shadow-xl mt-2">
        <figure>
          <img src={photoUrl} alt="user photo" className="rounded-full" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          <div>
          {age && <span>{age}</span>}{gender && <span>{", "+gender}</span>}
          </div>
          <p>{about}</p>
          <p>{skills}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-success">Connect</button>
            <button className="btn btn-secondary">Ignore</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
