import React, { useEffect, useRef } from 'react';
import Header from './Pages/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from './Pages/Homepage'
import Login from './Pages/Login';
import Register from './Pages/Register';
import SavedBuilds from './Pages/Components/SavedBuilds.jsx';
import Scene from './Pages/Scene'

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
        <Route path='/' element={<Login/>} />
          <Route path='/homepage' element={<HomePage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/savedbuilds' element={<SavedBuilds/>} />
          <Route path='/workspace' element={<Scene/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
