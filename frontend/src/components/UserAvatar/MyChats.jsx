import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Card } from "react-bootstrap";
import { MdGroupAdd } from "react-icons/md";
import ChatLoading from "../UiComponents/ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModel from "../UiComponents/GroupChatModel";
import AppToast from "../Authentication/AppToast";

function Mychats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [showToast, setShowToast] = useState(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chats", config);
      setChats(data);
    } catch (error) {
      setToastMessage("Error occurred!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <AppToast
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        toastVariant={toastVariant}
      />

      <Card
        className={`p-3 bg-white border ${
          selectedChat ? "d-none d-md-flex" : "d-flex"
        } flex-column align-items-center`}
        style={{
          backgroundColor: "white",
          height: "85vh",
          width: "100%",
          borderRadius: "0.75rem",
          border: "1px solid blue",
          padding: "1rem",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center w-100"
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <p className="mb-0 fs-5 mb-md-0">My chats</p>

          <GroupChatModel>
            <button className="rounded d-flex align-items-center gap-2 btn btn-outline-primary">
              New Group Chat <MdGroupAdd size={18} />
            </button>
          </GroupChatModel>
        </div>

        <div className="d-flex flex-column p-2 bg-light w-100 h-100 rounded-1 overflow-hidden">
          {chats ? (
            <Card.Body>
              {chats
                .filter((chat) => {
                  if (!chat.isGroupChat) {
                    const otherUser = chat.users.find(
                      (u) => u._id !== loggedUser?._id
                    );
                    return otherUser && otherUser.name;
                  }
                  return true; 
                })
                .map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className="cursor-pointer p-2 rounded-2 mb-2 d-flex gap-3"
                    style={{
                      backgroundColor:
                        selectedChat === chat ? "green" : "#E8E8E8",
                      color: selectedChat === chat ? "white" : "black",
                    }}
                  >
                    <img
                      src={
                        !chat.isGroupChat
                          ? chat.users.find(
                              (u) => u._id !== loggedUser._id
                            )?.image
                          : "https://icon-library.com/images/group-icon-png/group-icon-png-13.jpg"
                      }
                      alt="chat"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        backgroundColor: "grey",
                      }}
                    />
                    <p className="mb-0">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </p>
                  </div>
                ))}
            </Card.Body>
          ) : (
            <ChatLoading />
          )}
        </div>
      </Card>
    </>
  );
}

export default Mychats;
