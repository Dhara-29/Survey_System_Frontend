import logo from './logo.svg';
import './App.css';
import UserSignUp from './components/User/UserSignUp.js';
import { Routes, Route } from "react-router-dom";
import UserSignIn from './components/User/UserSignIn.js';
import Home from './components/User/Home.js';
import Header from './components/User/Header.js';
import CreateSurveys from './components/User/CreateSurveys.js';
function App() {
  return <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/userSignUp' element={<UserSignUp />} />
      <Route path='/userSignIn' element={<UserSignIn />} />
      <Route path='/createSurvey' element={<CreateSurveys/>} />

      <Route />
    </Routes>
  </>
}

export default App;
