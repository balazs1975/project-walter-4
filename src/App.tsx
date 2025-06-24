// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateExhibition from './pages/CreateExhibition';
import TrainWalter from './pages/TrainWalter';
// Completely commented out RequireAuth
// import RequireAuth from './routes/RequireAuth';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Direct access to create exhibition without any auth wrapper */}
        <Route path="/create-exhibition" element={<CreateExhibition />} />
        {/* Direct access to train walter without any auth wrapper */}
        <Route path="/train-walter" element={<TrainWalter />} />
      </Routes>
    </div>
  );
}

export default App;