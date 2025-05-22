
import './App.css'
import Login from './component/Login'
import { Routes, Route } from 'react-router-dom'
import Otp from './component/Otp'
import Home from './component/Home'
import Dashboard from './component/Dashboard'


function App() {


  return (
    <div className='bg-white h-screen w-screen items-center justify-center'>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/otp' element={<Otp></Otp>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
      </Routes>
     

    </div>
  )
}

export default App
