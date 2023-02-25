import React, { useEffect, useRef } from 'react';
import Header from './Pages/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from './Pages/Homepage'
import Login from './Pages/Login';
import Register from './Pages/Register';
import SavedBuilds from './Pages/SavedBuilds';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path='/homepage' element={<HomePage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/savedbuilds' element={<SavedBuilds/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
