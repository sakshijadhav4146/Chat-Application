import React, { useEffect, useState } from 'react'

import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/UiComponents/SideDrawer'

import ChatBox from '../components/UiComponents/ChatBox'
import Mychats from '../components/UserAvatar/MyChats'
function Chats() {
 
  const { user } = ChatState()
   const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <>
    <div style={{width:"100%", height:"80%"}}>

      {user && <SideDrawer/>}

      <div className='d-flex justify-content-between w-100 h-100 p-3 gap-3'>
        {user && <Mychats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </div>
    
    </div>
    
    </>
  )
}

export default Chats