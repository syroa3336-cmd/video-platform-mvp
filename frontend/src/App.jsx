import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Homepage from './pages/Homepage';
import Videos from './pages/Videos';
import Upload from './pages/Upload';
import VideoPlayer from './pages/VideoPlayer';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0a0a0a' : '#f9f9f9';
    document.body.style.color = darkMode ? '#f1f1f1' : '#0f0f0f';
  }, [darkMode]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="app">
            <Navbar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setSidebarOpen={setSidebarOpen}
            />
            <div className="main-layout">
              <Sidebar open={sidebarOpen} darkMode={darkMode} />
              <main className={`content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/video/:slug" element={<VideoPlayer />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </div>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;