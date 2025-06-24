// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateExhibition from './pages/CreateExhibition';
import TrainWalter from './pages/TrainWalter';
// import RequireAuth from './routes/RequireAuth';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/create-exhibition"
          element={
            // <RequireAuth>
              <CreateExhibition />
            // </RequireAuth>
          }
        />
        <Route
          path="/train-walter"
          element={
            // <RequireAuth>
              <TrainWalter />
            // </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;