import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaFutbol } from 'react-icons/fa';
import { useAuth } from '../../Context/useAuth';

interface Props {
    onToggleSidebar: () => void
}

const Navbar = ({ onToggleSidebar }: Props) => {
    const { isLoggedIn, user, logoutUser } = useAuth();
    return (
        <nav className="bg-blue-600 p-4 flex items-center justify-between shadow-md">
            <Link to="/">
                <div className="flex items-center text-white text-xl font-bold">
                    <FaFutbol className="mr-2" />
                    PitchSwitch
                </div>
            </Link>

            <button onClick={onToggleSidebar} className="text-white text-2xl md:hidden">
                <FaBars />
            </button>

            {isLoggedIn() && (
                <div className="hidden md:flex flex-grow justify-center">
                    <div className="bg-blue-500 p-2 rounded-lg shadow-md flex space-x-4">
                        <Link to="/home" className="text-white hover:text-gray-200 px-3 py-2 rounded hover:bg-blue-700 transition">
                            News
                        </Link>
                        <Link to="/clubsearch" className="text-white hover:text-gray-200 px-3 py-2 rounded hover:bg-blue-700 transition">
                            Clubs
                        </Link>
                        <Link to="/playersearch" className="text-white hover:text-gray-200 px-3 py-2 rounded hover:bg-blue-700 transition">
                            Players
                        </Link>
                        <Link to="/transfersearch" className="text-white hover:text-gray-200 px-3 py-2 rounded hover:bg-blue-700 transition">
                            Transfers
                        </Link>
                        <Link to="/transferrumoursearch" className="text-white hover:text-gray-200 px-3 py-2 rounded hover:bg-blue-700 transition">
                            Transfer Rumours
                        </Link>
                    </div>
                </div>
            )}

            {isLoggedIn() ? (
                <div className="hidden md:flex items-center space-x-4">
                    <Link
                        to={`/user/${user?.userName}`}
                        className="flex items-center space-x-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <span className="text-white font-medium">Welcome, {user?.userName}</span>
                        <img
                            src={
                                user?.profilePictureUrl && user.profilePictureUrl.trim().length > 0
                                    ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${user.profilePictureUrl}`
                                    : '/images/default_user_picture.png'
                            }
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    </Link>
                    <button
                        onClick={logoutUser}
                        className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="hidden md:flex space-x-4">
                    <Link
                        to="/login"
                        className="bg-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
