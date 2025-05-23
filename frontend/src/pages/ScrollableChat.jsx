import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isSameSenderMargin } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Tooltip, OverlayTrigger, Image, Button } from "react-bootstrap";
import { FaFilePdf, FaFileAlt, FaFileAudio, FaFileVideo, FaFileDownload } from "react-icons/fa";

function ScrollableChat({ messages }) {
  const { user } = ChatState("");
  
  // Format file size to readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to format dates
  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time portion for comparison
    const messageDateNoTime = new Date(messageDate);
    messageDateNoTime.setHours(0, 0, 0, 0);
    
    const todayNoTime = new Date(today);
    todayNoTime.setHours(0, 0, 0, 0);
    
    const yesterdayNoTime = new Date(yesterday);
    yesterdayNoTime.setHours(0, 0, 0, 0);
    
    if (messageDateNoTime.getTime() === todayNoTime.getTime()) {
      return "Today";
    } else if (messageDateNoTime.getTime() === yesterdayNoTime.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = [];
    let currentDate = null;
    
    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt);
      messageDate.setHours(0, 0, 0, 0); // Reset time for comparison
      
      if (!currentDate || currentDate.getTime() !== messageDate.getTime()) {
        currentDate = messageDate;
        groupedMessages.push({
          type: 'date',
          date: message.createdAt,
          id: `date-${index}`
        });
      }
      
      groupedMessages.push({
        type: 'message',
        message: message,
        index: index
      });
    });
    
    return groupedMessages;
  };

  // Function to handle file attachments
  const FileAttachment = ({ message }) => {
    const { fileType, fileUrl, fileName, fileSize } = message;
    
    // Download file function
    const handleDownload = () => {
      window.open(fileUrl, '_blank');
    };
    
    // Render different file types
    switch (fileType) {
      case "image":
        return (
          <div className="message-attachment">
            <div className="image-preview mb-1" style={{ maxWidth: '250px' }}>
              <Image 
                src={fileUrl} 
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} 
                alt={fileName || "Image"} 
              />
            </div>
            <div className="d-flex align-items-center">
              <small className="text-truncate" style={{ maxWidth: '180px' }}>
                {fileName}
              </small>
              <small className="ms-2 text-muted">
                ({formatFileSize(fileSize)})
              </small>
              <Button 
                variant="link" 
                size="sm" 
                className="ms-auto p-0" 
                onClick={handleDownload}
              >
                <FaFileDownload />
              </Button>
            </div>
          </div>
        );
        
      case "video":
        return (
          <div className="message-attachment">
            <video 
              controls 
              style={{ maxWidth: '250px', maxHeight: '200px', borderRadius: '8px' }}
              className="mb-1"
            >
              <source src={fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="d-flex align-items-center">
              <small className="text-truncate" style={{ maxWidth: '180px' }}>
                {fileName}
              </small>
              <small className="ms-2 text-muted">
                ({formatFileSize(fileSize)})
              </small>
            </div>
          </div>
        );
        
      case "audio":
        return (
          <div className="message-attachment">
            <div className="d-flex align-items-center mb-2">
              <FaFileAudio size={20} className="me-2" />
              <small className="text-truncate" style={{ maxWidth: '180px' }}>
                {fileName}
              </small>
              <small className="ms-2 text-muted">
                ({formatFileSize(fileSize)})
              </small>
            </div>
            <audio controls style={{ maxWidth: '250px' }}>
              <source src={fileUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
        
      case "pdf":
        return (
          <div className="message-attachment p-2 border rounded bg-light" style={{ maxWidth: '250px' }}>
            <div className="d-flex align-items-center">
              <FaFilePdf size={24} className="text-danger me-2" />
              <div className="flex-grow-1">
                <div className="text-truncate">{fileName}</div>
                <small className="text-muted">{formatFileSize(fileSize)}</small>
              </div>
              <Button 
                variant="link" 
                className="p-0 ms-2" 
                onClick={handleDownload}
              >
                <FaFileDownload />
              </Button>
            </div>
          </div>
        );
        
      case "document":
      default:
        return (
          <div className="message-attachment p-2 border rounded bg-light" style={{ maxWidth: '250px' }}>
            <div className="d-flex align-items-center">
              <FaFileAlt size={24} className="text-primary me-2" />
              <div className="flex-grow-1">
                <div className="text-truncate">{fileName}</div>
                <small className="text-muted">{formatFileSize(fileSize)}</small>
              </div>
              <Button 
                variant="link" 
                className="p-0 ms-2" 
                onClick={handleDownload}
              >
                <FaFileDownload />
              </Button>
            </div>
          </div>
        );
    }
  };

  const groupedItems = groupMessagesByDate(messages || []);

  return (
    <ScrollableFeed>
      {groupedItems.map((item) => {
        if (item.type === 'date') {
          // Render date separator
          return (
            <div 
              key={item.id} 
              className="text-center my-3"
            >
              <div 
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  backgroundColor: '#E2E8F0',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#4A5568'
                }}
              >
                {formatMessageDate(item.date)}
              </div>
            </div>
          );
        } else {
          // Render message
          const m = item.message;
          const i = item.index;
          const isOwnMessage = m.sender._id === user._id;

          return (
            <div
              key={m._id}
              style={{
                display: "flex",
                flexDirection: isOwnMessage ? "row-reverse" : "row",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              {/* Avatar and Tooltip */}
              {!isOwnMessage &&
                (isSameSender(messages, m, i, user._id) ||
                  isSameSenderMargin(messages, m, i, user._id)) && (
                  <OverlayTrigger
                    placement="bottom-start"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip id="avatar-tooltip">{m.sender.name}</Tooltip>
                    }
                  >
                    <Image
                      src={m.sender.image}
                      roundedCircle
                      alt="User Avatar"
                      width={30}
                      height={30}
                      style={{
                        cursor: "pointer",
                        objectFit: "cover",
                        marginRight: "5px",
                      }}
                    />
                  </OverlayTrigger>
                )}

              {/* Message Bubble */}
              <div
                style={{
                  backgroundColor: isOwnMessage ? "#BEE3F8" : "#B9F5D0",
                  borderRadius: "20px",
                  padding: "8px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginRight: "10px",
                }}
              >
                {/* If message has attachment, render the file component */}
                {m.attachment ? (
                  <FileAttachment message={m} />
                ) : (
                  <span>{m.content}</span>
                )}
                
                {/* Timestamp */}
                <div className="text-end">
                  <small className="text-muted" style={{ fontSize: '10px' }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </div>
            </div>
          );
        }
      })}
    </ScrollableFeed>
  );
}

export default ScrollableChat;