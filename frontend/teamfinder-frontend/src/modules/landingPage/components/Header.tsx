import { useState } from "react";

function Header() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

  return (
    <nav className="flex mb-4 justify-between w-full">
        <a href="/"><h2 className="text-3xl font-bold text-black dark:text-white">TeamFinder</h2></a>
        <button className="z-50" onClick={toggleMenu}><i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i></button>

        <div className={`fixed top-0 left-0 w-full h-screen bg-slate-100 dark:bg-zinc-700 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${ isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <a href="/" className="text-2xl text-black dark:text-white hover:text-gray-400">Home</a>
            <a href="login" className="text-2xl text-black dark:text-white hover:text-gray-400">Log In</a>
        </div>
    </nav>
  )
}

export default Header;
