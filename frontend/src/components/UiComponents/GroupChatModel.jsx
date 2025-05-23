import React, { useState } from "react";
import { Form, Button, Modal, Spinner } from "react-bootstrap"; 
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import AppToast from "../Authentication/AppToast";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

function GroupChatModel({ children }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { user, chats, setChats } = ChatState();

  //////////// search to add in group /////////////////
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setToastMessage("Search failed!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };
//////////// create group //////////////////
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      setToastMessage("please fill all the fields");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data,...chats]);
      handleClose();
      setToastMessage("New Group created 🎉");
      setToastVariant("success");
      setShowToast(true);
      return;

    } catch (error) {
      setToastMessage("Error occurred,Failed to create group");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
  };

  /////// select the group members///////////
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setToastMessage("User already added");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  //////////////// delete the selected member ////////////////
  const handleDelete = (userDelete) => {
    setSelectedUsers(
      selectedUsers.filter(
        (selectedUser) => selectedUser._id !== userDelete._id
      )
    );
  };
  return (
    <>
      <span variant="primary" onClick={handleShow}>
        {children}
      </span>

      <Modal show={show} onHide={handleClose} style={{ marginTop: "2%" }}>
        <Modal.Header closeButton className="text-center">
          <Modal.Title className="w-100" style={{ fontFamily: "sans-serif" }}>
            Create Group Chat
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <AppToast
            showToast={showToast}
            setShowToast={setShowToast}
            toastMessage={toastMessage}
            toastVariant={toastVariant}
          />

          <Form>
            <Form.Group className="d-flex  align-items-center mb-3">
              <Form.Label
                style={{
                  width: "160px",
                  marginRight: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Group Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Chat Name"
                autoFocus
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="d-flex  align-items-center mb-3">
              <Form.Label
                style={{
                  width: "160px",
                  marginRight: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Add Members
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Members name"
                autoFocus
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Form.Group>
            {/*rendering selected users....... */}
            <div className="d-flex ">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>

            {/* search user rendering..............*/}
            {loading ? (
              <Spinner animation="border" variant="info" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                    isSmall={true}
                  />
                ))
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Create Chat
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GroupChatModel;
