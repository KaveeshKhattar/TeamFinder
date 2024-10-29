import { useState } from "react";
import { useAuth } from "../../core/hooks/useAuth";
import { HeaderProps } from "../../../types";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";

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
        <h2><Link to="/"><span className="text-2xl font-bold text-black dark:text-white">TeamFinder</span></Link></h2>
      </div>

      {/* Hamburger */}
      <div className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white dark:bg-zinc-700 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <Link to="/signup" className="text-2xl text-black dark:text-white hover:text-gray-400">
          <Button>Sign Up</Button>
        </Link>
        <Link to="/login" className="text-2xl text-black dark:text-white hover:text-gray-400">
          <Button variant="secondary">Login</Button>
        </Link>
        <Link to="/" className="text-2xl text-black dark:text-white hover:text-gray-400">
          Home
        </Link>
        {isSignedIn ? (
          <>
            <Link to="/colleges" className="text-2xl text-black dark:text-white hover:text-gray-400">
              Colleges
            </Link>
            <Link to="/events" className="text-2xl text-black dark:text-white hover:text-gray-400">
              Events
            </Link>
            <Link to="/teams" className="text-2xl text-black dark:text-white hover:text-gray-400">
              Teams
            </Link>

          </>
        ) : (
          <button></button>
        )}
      </div>

      {/* Links visible on md and above */}
      <div className="hidden md:flex space-x-4 items-center justify-center">
        <Link to="/" className="text-2xl text-black dark:text-white hover:text-gray-400">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link to="/colleges" className="text-2xl text-black dark:text-white hover:text-gray-400">
          <Button variant="ghost">Colleges</Button>
        </Link>
        <Link to="/events" className="text-2xl text-black dark:text-white hover:text-gray-400">
          <Button variant="ghost">Events</Button>
        </Link>
        <Link to="/teams">
          <Button variant="ghost">Teams</Button>
        </Link>

        {/* <Link to="/colleges" className="text-black dark:text-white p-2 rounded">Colleges</Link>
          <Link to="/events" className="text-black dark:text-white p-2 rounded">Events</Link>
          <Link to="/teams" className="text-black dark:text-white p-2 rounded">Teams</Link> */}
      </div>

      <div className="flex items-center">
        {isSignedIn ? (
          <Link to="/profile">
            <Button>Profile</Button>
          </Link>

        ) : (
          <></>
          // <button className="p-2"><a href="/login">Sign In</a></button>
        )}
      </div>


    </nav>
  )
}

export default Header;
