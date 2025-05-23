import React, { useState } from "react";
import {
  Button,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Image,
  Badge,
} from "react-bootstrap";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import AppToast from "../Authentication/AppToast";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

function SideDrawer() {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { setUser } = ChatState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      search user
    </Tooltip>
  );

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      setToastMessage("Please enter the text");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoadingChat(false);
      setSearchResult(data);
    } catch (error) {
      setToastMessage("Error occurred!");
      setToastVariant("danger");
      setShowToast(true);
      setLoadingChat(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chats", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      handleClose();
    } catch (error) {
      setToastMessage("Error occurred!");
      setToastVariant("danger");
      setShowToast(true);
      setLoadingChat(false);
    }
  };

  // Handle click on notification item:
  const handleNotificationClick = (notify) => {
    setSelectedChat(notify.chats);
    setNotification(notification.filter((n) => n._id !== notify._id));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center bg-white w-100 border-1 p-2">
        {/* Search Button with Tooltip */}
        <OverlayTrigger placement="bottom" overlay={renderTooltip}>
          <Button variant="light" className="d-flex m-2" onClick={handleShow}>
            <i className="fa-solid fa-magnifying-glass m-1" />
            <p className="d-none d-md-flex ms-2 mb-0">Search User</p>
          </Button>
        </OverlayTrigger>

        <p className="m-1 fs-4 font-monospace">
          Chit-Chat <i className="fa-regular fa-comment"></i>
        </p>

        {/* Notification Dropdown */}
        <Dropdown align="end" className="me-3">
          <Dropdown.Toggle
            variant="light"
            id="dropdown-basic"
            className="position-relative"
            style={{ fontSize: "20px" }}
          >
            <i className="fa-solid fa-bell"></i>
            {notification.length > 0 && (
              <Badge
                pill
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: "10px", width: "18px", height: "18px" }}
              >
                {notification.length}
              </Badge>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: "300px", maxHeight: "300px", overflowY: "auto" }}>
            {notification.length === 0 ? (
              <Dropdown.Item disabled>No New Messages</Dropdown.Item>
            ) : (
              notification.map((notify) => (
                <Dropdown.Item
                  key={notify._id}
                  onClick={() => handleNotificationClick(notify)}
                  style={{ whiteSpace: "normal" }}
                >
                  {notify.chats ? (
                    notify.chats.isGroupChat
                      ? `New message in ${notify.chats.chatName}`
                      : `New message from ${getSender(user, notify.chats.users)}`
                  ) : (
                    "New message"
                  )}
                </Dropdown.Item>
              ))
            )}
          </Dropdown.Menu>
        </Dropdown>

        {/* User Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="dropdown-basic"
            className="d-flex align-items-center"
            style={{ minWidth: "150px" }}
          >
            <Image
              src={user.image}
              roundedCircle
              width={35}
              height={35}
              alt="User Avatar"
              className="me-2"
            />
            <span>{user.name}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ zIndex: 1050 }} container={document.body}>
            <ProfileModal user={user}>
              <Dropdown.Item eventKey="1">My Profile</Dropdown.Item>
            </ProfileModal>
            <Dropdown.Item eventKey="2" onClick={logoutHandler}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* ///////////////////// Drawer ////////////////////// */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <AppToast
          showToast={showToast}
          setShowToast={setShowToast}
          toastMessage={toastMessage}
          toastVariant={toastVariant}
        />
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search User</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search the user"
            className="m-3"
          />
          <Button
            onClick={handleSearch}
            style={{ height: "30px", marginTop: "-2px", fontSize: "12px" }}
          >
            Search
          </Button>
          {loadingChat ? (
            <ChatLoading />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideDrawer;
