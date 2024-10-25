import { useState } from "react";
import { useAuth } from "../../core/hooks/useAuth";
import { HeaderProps } from "../../../types";
import profilePic from "../../profile/assets/profile-pic.jpg"
import { Link } from "react-router-dom";

function Header({ title }: HeaderProps) {

  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  return (
    <nav className="flex mb-4 justify-between w-full">

      <div className="flex items-center">
        <button className="z-50 text-sm px-3 py-2 mr-2 md:hidden" onClick={toggleMenu}><i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i></button>
        <h2 className="text-2xl font-bold text-black dark:text-white">{title}</h2>
      </div>

       {/* Hamburger */}
       <div className={`md:hidden fixed top-0 left-0 w-full h-screen bg-slate-100 dark:bg-zinc-700 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <a href="/" className="text-2xl text-black dark:text-white hover:text-gray-400">Home</a>
      {isSignedIn ? (
        <a href="/colleges" className="text-2xl p-1 text-black dark:text-white ">Explore Teams</a>
      ) : (
        <button></button>
      )}
      </div>

      {/* Links visible on md and above */}
      <div className="hidden md:flex space-x-4 items-center justify-center">
          <Link to="/" className="text-white hover:bg-gray-700 p-2 rounded">Home</Link>
          <Link to="/colleges" className="text-white hover:bg-gray-700 p-2 rounded">Explore Teams</Link>
      </div>

      <div className="flex items-center">
        {isSignedIn ? (
          <button className="text-sm p-2 mr-2"><a href="/profile">
            <img src={profilePic} alt="" className="w-10 rounded-md" />
          </a></button>
        ) : (
          <button className="p-2"><a href="/login">Sign In</a></button>
        )}
      </div>

     
    </nav>
  )
}

export default Header;
