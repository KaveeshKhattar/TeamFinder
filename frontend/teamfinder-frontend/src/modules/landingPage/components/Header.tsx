import { useState } from "react";
import { useAuth } from "../../core/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";

function Header() {

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
      <div className={`md:hidden fixed mr-2 top-0 left-0 w-full h-screen bg-white dark:bg-black flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex flex-col gap-5 w-full p-2 mt-16">
        <Link to="/signup">
            <Button className="w-full">Sign Up</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="w-full">Login</Button>
          </Link>

          <Link to="/" >
            <Button variant="outline" className="w-full">Home</Button>
          </Link>

          <Link to="/colleges" >
            <Button variant="outline" className="w-full">Colleges</Button>

          </Link>
          <Link to="/events">
            <Button variant="outline" className="w-full">Events</Button>
          </Link>
          <Link to="/teams">
            <Button variant="outline" className="w-full">Teams</Button>
          </Link>
        </div>
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
