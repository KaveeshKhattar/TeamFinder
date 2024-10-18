import { useState } from "react";
import { useAuth } from "../../core/hooks/useAuth";

function Header() {

    const [isOpen, setIsOpen] = useState(false);
    const { isSignedIn } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

  return (
    <nav className="flex mb-4 justify-between w-full">

        <div className="flex items-center">
          <button className="z-50 text-sm px-3 py-2 mr-2" onClick={toggleMenu}><i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i></button>
          <a href="/"><h2 className="text-2xl font-bold text-black dark:text-white">TeamFinder</h2></a>          
        </div>

        <div className="flex items-center">
          {isSignedIn ? (
                  <button className="text-sm p-2 mr-2"><a href="/profile">Profile</a></button>
            ) : (
                  <button><a href="/login">Sign In</a></button>
            )}
        </div>        

          <div className={`fixed top-0 left-0 w-full h-screen bg-slate-100 dark:bg-zinc-700 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${ isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <a href="/" className="text-2xl text-black dark:text-white hover:text-gray-400">Home</a>
            {isSignedIn ? (
                  <a href="/home" className="text-2xl p-1 text-black dark:text-white ">Explore Teams</a>
            ) : (
              <button></button>
            )}
            
        </div>
    </nav>
  )
}

export default Header;
