import {BrowserRouter as Router, Routes, Route}  from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route  path='/' element={<Explore/>}/>
          <Route  path='/offers' element={<Offers/>}/>
          <Route  path='/profile' element={<Profile/>}/>
          <Route  path='/sign-in' element={<SignIn/>}/>
          <Route  path='/sign-up' element={<SignUp/>}/>
          <Route  path='/forgot-password' element={<ForgotPassword/>}/>
          {/* <Route  path='/*' element={<Explore/>}/>  */}
        </Routes>
        <Navbar/>
      </Router>
      <ToastContainer position="top-center"/>
    </>
  )
}

export default App