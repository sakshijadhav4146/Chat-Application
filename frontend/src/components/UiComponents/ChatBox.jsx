import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "../../pages/SingleChat";

function ChatBox({fetchAgain,setFetchAgain}) {
  const { selectedChat } = ChatState();

  return (
    <>
      <div
        className={`p-3 border col-12 col-md-8 rounded-4 ${
          selectedChat ? "d-flex" : "d-none d-md-flex"
        } flex-column align-items-center h-100`}
         style={{
        minHeight: "85vh",
        backgroundColor:"whitesmoke" 
      }}
      >

        {/* /////// functionality of single chat///////// */}
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>

        {/* ///// functionality for multiple chats ////////////// */}
      </div>
    </>
  );
}

export default ChatBox;
