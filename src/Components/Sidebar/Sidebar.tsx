import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({isOpen, onClose}: Props) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { isLoggedIn, user, logoutUser } = useAuth();
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <aside className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div ref={sidebarRef} className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
                <button className="text-white p-4" onClick={onClose}>X</button><span>Welcome, {user?.userName}</span>
                <ul className="">
                    <li><Link to="/home" onClick={onClose} className="block p-4 hover:bg-gray-700">News</Link></li>
                </ul>
                {isLoggedIn() ? (
                    <div className="mt-auto p-4 space-y-2">
                        <a onClick={logoutUser} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">Logout</a>
                    </div>
                ) : (
                    <div className="mt-auto p-4 space-y-2">
                        <Link to="/login" onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 w-full block text-center">
                        Sign In
                        </Link>
                        <Link to="/register" onClick={onClose} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 w-full block text-center">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </aside>
  )
}

export default Sidebar