import React from 'react'
import { Link } from 'react-router-dom';
import { FaBars, FaFutbol } from 'react-icons/fa';

interface Props {
    onToggleSidebar: () => void
}

const Navbar = ({onToggleSidebar}: Props) => {
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
            <div className="hidden md:flex space-x-4 flex-grow flex justify-center">
                <Link to="/home" className="text-white hover:underline">News</Link>
            </div>
        <div className="hidden md:flex space-x-4">
            <Link to="/login" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">Sign In</Link>
            <Link to="/register" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300">Register</Link>
        </div>
    </nav>
  )
}

export default Navbar