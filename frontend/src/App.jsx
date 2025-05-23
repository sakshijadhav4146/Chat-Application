import "./App.css"
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Chats from './pages/Chats';
function App() {


  return (
    <>
   <div className="App">
    <Routes>
    <Route path="/" element={<Homepage/>}></Route>
    <Route path="/chats" element={<Chats/>}></Route>
    </Routes> 
   </div>
    </>
  )
}

export default App
