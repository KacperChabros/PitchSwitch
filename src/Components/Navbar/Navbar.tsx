import React from 'react'
import { Link } from 'react-router-dom';
import { FaBars, FaFutbol } from 'react-icons/fa';
import { useAuth } from '../../Context/useAuth';

interface Props {
    onToggleSidebar: () => void
}

const Navbar = ({onToggleSidebar}: Props) => {
    const { isLoggedIn, user, logoutUser } = useAuth();
    return (
        <nav className="bg-blue-600 p-4 flex items-center justify-between">
            <Link to="/">
                <div className="flex items-center text-white text-lg font-bold pi">
                        <FaFutbol className="mr-2" />
                        PitchSwitch
                </div>
            </Link>
            <button onClick={onToggleSidebar} className="text-white text-2xl md:hidden">
                <FaBars />
            </button>
            {isLoggedIn() && (
                <div className="hidden md:flex space-x-4 flex-grow flex justify-center">
                    <Link to="/home" className="text-white hover:underline">News</Link>
                    <Link to="/clubsearch" className="text-white hover:underline">Clubs</Link>
                    <Link to="/playersearch" className="text-white hover:underline">Players</Link>
                    <Link to="/transfersearch" className="text-white hover:underline">Transfers</Link>
                    <Link to="/transferrumoursearch" className="text-white hover:underline">Transfer Rumours</Link>
                </div>
            )}
            {isLoggedIn() ? (
                <div className="hidden md:flex items-center space-x-6 justify-between">
            
                    <div className='text-white font-bold py-2 px-1'>Welcome, {user?.userName}</div>
                    <img
                        src={user?.profilePictureUrl && user.profilePictureUrl.trim().length > 0 ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${user.profilePictureUrl}` : "/images/default_user_picture.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover justify-center"
                    />      
                    <a onClick={logoutUser} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">Logout</a>
                </div>
            ) : (
                <div className="hidden md:flex space-x-4">
                    <Link to="/login" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">Sign In</Link>
                    <Link to="/register" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">Register</Link>
                </div>
            )}
            
        </nav>
    )
}

export default Navbar