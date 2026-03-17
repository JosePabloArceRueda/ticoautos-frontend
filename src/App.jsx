import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { VehicleDetail } from './pages/VehicleDetail';
import { StartChat } from './pages/StartChat';
import { ChatDetail } from './pages/ChatDetail';
import { ChatsList } from './pages/ChatsList';
import { Dashboard } from './pages/Dashboard';
import { VehicleForm } from './pages/VehicleForm';
import { DeleteVehicleConfirm } from './pages/DeleteVehicleConfirm';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route
            path="/vehicles/:vehicleId/chat/new"
            element={
              <ProtectedRoute>
                <StartChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <ChatsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats/:chatId"
            element={
              <ProtectedRoute>
                <ChatDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vehicles/new"
            element={
              <ProtectedRoute>
                <VehicleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vehicles/:id/edit"
            element={
              <ProtectedRoute>
                <VehicleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vehicles/:id/delete"
            element={
              <ProtectedRoute>
                <DeleteVehicleConfirm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;