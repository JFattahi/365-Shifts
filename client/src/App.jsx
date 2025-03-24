import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Punch from './pages/Punch.jsx'
import './App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/punch" element={<Punch />} />
      </Routes>
    </Router>
  )
}

export default App
