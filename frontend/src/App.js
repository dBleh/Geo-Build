import React, { useEffect, useRef } from 'react';
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from './Pages/Homepage'

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path='/homepage' element={<HomePage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
