import React from "react";
import { IoIosClose } from "react-icons/io";
function UserBadgeItem({user, handleFunction}) {
  return (
    <>
      <div
        className="px-2 py-1 rounded-4 m-1 mb-2 fs-6 text-white"
        style={{boxShadow: "0 2px 6px #A53860", backgroundColor:"#A53860",cursor:"pointer"}}
        onClick={handleFunction}
      >

        {user.name}

        <IoIosClose size={25}/>
      </div>
    </>
  );
}

export default UserBadgeItem;
