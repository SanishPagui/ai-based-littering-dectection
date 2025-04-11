import React from "react";

const HallOfShame = ({ users }) => {
  return (
    <div>
      <h1>Hall of Shame</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index} className="user">
            <img src={user.image} alt={user.name} />
            <p>{user.name}</p>
            <p>{user.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfShame;