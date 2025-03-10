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
            <div ref={sidebarRef} className={`fixed top-0 left-0 h-full w-72 bg-gray-900 text-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
                
                {isLoggedIn() ? (
                    <div>
                        <div className="flex items-center space-x-4">
                            <button className="text-white p-4" onClick={onClose}>X</button>
                            <Link to={`/user/${user?.userName}`} className="flex items-center space-x-2 hover:bg-gray-700">
                                <span className="text-white">Welcome, {user?.userName}</span>
                                <img
                                    src={user?.profilePictureUrl && user.profilePictureUrl.trim().length > 0 
                                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${user.profilePictureUrl}` 
                                        : "/images/default_user_picture.png"
                                    }
                                    alt="Profile"
                                    className="w-7 h-7 rounded-full object-cover"
                                />
                            </Link>
                        </div>  
                        <ul className="">
                            <li><Link to="/home" onClick={onClose} className="block p-4 hover:bg-gray-700">News</Link></li>
                            <li><Link to="/clubsearch" onClick={onClose} className="block p-4 hover:bg-gray-700">Clubs</Link></li>
                            <li><Link to="/playersearch" onClick={onClose} className="block p-4 hover:bg-gray-700">Players</Link></li>
                            <li><Link to="/transfersearch" onClick={onClose} className="block p-4 hover:bg-gray-700">Transfers</Link></li>
                            <li><Link to="/transferrumoursearch" onClick={onClose} className="block p-4 hover:bg-gray-700">Transfer Rumours</Link></li>
                        </ul>
                        <div className="mt-auto p-4 space-y-2">
                            <a onClick={logoutUser} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 w-full block text-center">Logout</a>
                        </div>
                    </div>
                    
                ) : (
                    <div>
                        <button className="text-white p-4" onClick={onClose}>X</button><span>Hello there, sign in!</span>
                        <div className="mt-auto p-4 space-y-2">
                            <Link to="/login" onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 w-full block text-center">
                            Sign In
                            </Link>
                            <Link to="/register" onClick={onClose} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 w-full block text-center">
                                Register
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </aside>
  )
}

export default Sidebar