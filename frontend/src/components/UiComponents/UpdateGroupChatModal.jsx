import React, { useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import AppToast from "../Authentication/AppToast";
import Chats from "../../pages/Chats";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain ,fetchMessages}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [showToast, setShowToast] = useState(false);

  /////////////////// Add member to group //////////////////////////

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      setToastMessage("Member Already exists");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      setToastMessage("Only admin can add someone!");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setGroupChatName("");
    } catch (error) {
      setToastMessage("Error Occurred!");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
  };

  ///////////////////////////// Remove member from group //////////////////

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      setToastMessage("Only admin can remove someone!");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
    } catch (error) {
      setToastMessage("Error occurred!");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
  };

  //////////////////////////// Rename the group name //////////////////////
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chats/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setToastMessage("Error Occurred");
      setToastVariant("danger");
      setShowToast(true);
      setRenameLoading(false);
      return;
    }
    setGroupChatName("");
  };

  ///////////////////////////// Search user to add ///////////////////////
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setToastMessage("Search failed!");
      setToastVariant("danger");
      setShowToast(true);
      setLoading(false);
    }
  };

  const { selectedChat, setSelectedChat, user } = ChatState();
  return (
    <>
      <div
        onClick={handleShow}
        className="text-primary"
        style={{ cursor: "pointer", fontSize: "15px" }}
      >
        <FaEye /> Peek Profile
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            {selectedChat.chatName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AppToast
            showToast={showToast}
            setShowToast={setShowToast}
            toastMessage={toastMessage}
            toastVariant={toastVariant}
          />
          <div className="w-100 d-flex flex-wrap pb-3">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>
          <Form>
            <Form.Group className="d-flex mb-3">
              <Form.Control
                type="text"
                placeholder="Enter new group name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button
                disabled={renameLoading}
                onClick={handleRename}
                className="bg-success m-lg-1 rounded p-2 border-0"
              >
                Update
              </button>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Member to Add in group"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="mb-3"
              />
              {loading ? (
                <Spinner
                  animation="border"
                  variant="info"
                  className="text-center"
                />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                    isSmall={true}
                  />
                ))
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleRemove(user)}>
            Leave Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
