import { MdArrowBack } from "react-icons/md";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "../components/UiComponents/ProfileModal";
import { FaEye, FaPaperclip } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import UpdateGroupChatModal from "../components/UiComponents/UpdateGroupChatModal";
import { useState, useEffect, useRef } from "react";
import { Form, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import AppToast from "../components/Authentication/AppToast";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import animationData from "../Animations/typing.json";
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setToastMessage("File size exceeds 10MB limit");
      setToastVariant("warning");
      setShowToast(true);
      return;
    }

    setFileAttachment(file);
    // Show file name in chat input
    setNewMessage(`File: ${file.name}`);
  };

  const resetFileInput = () => {
    setFileAttachment(null);
    setNewMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    socket.emit("stop typing", selectedChat._id);
    
    // Don't send if there's no message and no file attachment
    if (!newMessage.trim() && !fileAttachment) return;
    
    try {
      setUploadingFile(!!fileAttachment);
      
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      
      // Only append content if there's an actual message (not just file info)
      if (!newMessage.startsWith("File: ") || !fileAttachment) {
        formData.append("content", newMessage);
      }
      
      if (fileAttachment) {
        formData.append("file", fileAttachment);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          // Don't set Content-Type - axios will set it with boundary for FormData
        },
      };

      const { data } = await axios.post("/api/message", formData, config);

      setNewMessage("");
      resetFileInput();
      setUploadingFile(false);
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      setUploadingFile(false);
      setToastMessage("Error Occurred!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setToastMessage("Error Occurred!");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chats._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      <AppToast
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        toastVariant={toastVariant}
      />
      {selectedChat ? (
        <div className="d-flex flex-column h-100 w-100">
          {/* Chat Header */}
          <div
            className="d-flex justify-content-between align-items-center px-2 pb-3"
            style={{ fontSize: "28px", fontFamily: "Work Sans" }}
          >
            <button
              className="btn btn-outline-secondary d-md-none"
              onClick={() => setSelectedChat("")}
            >
              <MdArrowBack size={24} />
            </button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <span
                    className="ms-2 text-primary fs-6"
                    style={{ cursor: "pointer" }}
                  >
                    <FaEye /> Peek Profile
                  </span>
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </div>

          <div
            className="flex-grow-1 p-0 rounded-2 overflow-hidden"
            style={{
              minHeight: "72vh",
              height: "100%",
              backgroundColor: "#E4EFE7",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading ? (
              <div className="d-flex flex-grow-1 justify-content-center align-items-center w-100 h-100">
                <Spinner animation="border" variant="info" />
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-grow-1 p-3 overflow-auto">
                  <div
                    className="d-flex flex-column overflow-y-scroll"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <ScrollableChat messages={messages} />
                    {isTyping && (
                      <div className="d-flex align-items-center ps-2">
                        <span className="text-muted">
                          <Lottie
                            animationData={animationData}
                            loop={true}
                            autoplay={true}
                            style={{ width: 70, height: 70 }}
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* File Attachment Preview */}
                {fileAttachment && (
                  <div className="px-3 py-2 bg-light border-top d-flex align-items-center">
                    <div className="text-truncate">
                      <small className="text-muted">Attached: </small>
                      {fileAttachment.name}
                    </div>
                    <Button 
                      variant="link" 
                      className="text-danger ms-auto p-0" 
                      onClick={resetFileInput}
                      style={{ fontSize: '14px' }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                
                {/* Input Box */}
                <Form
                  className="p-2 border-top bg-white"
                  onSubmit={sendMessage}
                >
                  <div className="d-flex align-items-center" style={{ position: "relative" }}>
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    
                    {/* Attachment button */}
                    <Button 
                      variant="link" 
                      className="text-secondary p-0 me-2"
                      onClick={() => fileInputRef.current.click()}
                      disabled={uploadingFile}
                    >
                      <FaPaperclip size={18} />
                    </Button>
                    
                    <Form.Control
                      type="text"
                      placeholder={fileAttachment ? "Add a caption (optional)" : "Enter the message"}
                      value={newMessage}
                      onChange={typingHandler}
                      disabled={uploadingFile}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage(e);
                      }}
                    />
                    <button
                      type="submit"
                      disabled={uploadingFile}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {uploadingFile ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FiSend />
                      )}
                    </button>
                  </div>
                </Form>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center h-100 w-100">
          <p
            className="fs-2 pb-3 font-monospace text-center"
            style={{ marginTop: "25%" }}
          >
            No chat selected
          </p>
        </div>
      )}
    </>
  );
}

export default SingleChat;