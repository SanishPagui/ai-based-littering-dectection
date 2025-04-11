import React from "react";

const HallOfFame = ({ users }) => {
  return (
    <div>
      <h1>Hall of Fame</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index} className="user">
            <img src={user.image} alt={user.name} />
            <p>{user.name}</p>
            <p>{user.achievement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfFame;