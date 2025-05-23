import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';


function Homepage() {
  const [showComponent,setShowComponent] = useState("")
  const { setUser } = ChatState(); 

  const navigate = useNavigate()

   useEffect(()=>{
         const userInfo = JSON.parse(localStorage.getItem("userInfo"))
         setUser(userInfo);
         
         if(!userInfo){
           navigate('/chats')
         }
      },[navigate])

  return (
    <Container className="text-white d-flex flex-column justify-content-start align-items-center min-vh-100 pt-5">
      <div className="bg-white text-dark w-100 border rounded-pill p-2 text-center" style={{ maxWidth: '500px' }}>
        <h2 className="mb-0 ">Chit-Chat</h2>
      </div>
      
      <div className="bg-white text-dark w-100 border rounded p-2 text-center mt-3" style={{ maxWidth: '500px',height:"78vh" }}>
        <div className='d-flex justify-between'>
        <Button className=' rounded-pill w-50 me-2 ' variant='success' onClick={()=>setShowComponent('login')}>Login</Button>
        <Button className='rounded-pill w-50 ms-2' variant='primary' onClick={()=>setShowComponent("signup")}>SignUp</Button>
        </div>
      {showComponent=="login"?<Login/>:<SignUp/>}
      </div>
    </Container>
  );
}

export default Homepage;
