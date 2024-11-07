import { Outlet } from 'react-router-dom';
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './Context/useAuth';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

  return (
    <>
        <UserProvider>
          <ErrorBoundary>
            <Navbar onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <Outlet/>
            <ToastContainer/>
          </ErrorBoundary>
        </UserProvider>     
    </>
  );
}

export default App;
