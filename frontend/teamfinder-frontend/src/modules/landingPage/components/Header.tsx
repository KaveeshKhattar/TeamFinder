import { useState } from "react";
import { useAuth } from "../../core/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "../../../components/modeToggle";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const token = localStorage.getItem("token");

  const handleSignOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signOut();
    localStorage.removeItem("token");
    localStorage.setItem("isSignedIn", "false");
    navigate("/");
  };

  return (
    <nav className="flex mb-4 items-center w-full">
      {/* Wrapper for all content */}
      <div className="flex items-center justify-between w-full">
        {/* Left Section with Logo */}
        <div className="flex items-center">
          <button
            className="z-50 text-sm px-3 py-2 mr-2 md:hidden rounded-md dark:bg-black dark:text-white"
            onClick={toggleMenu}
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
          <h2>
            <Link to="/">
              <span className="text-2xl font-bold text-black dark:text-white">
                TeamFinder
              </span>
            </Link>
          </h2>
        </div>

        {/* Centered Links for Medium and Above */}
        <div className="hidden md:flex flex-1 justify-center space-x-4 ">
          <Link to="/">
            <Button
              variant="ghost"
              className="dark:bg-zinc-700 dark:text-white"
            >
              Home
            </Button>
          </Link>
          <Link to="/colleges">
            <Button
              variant="ghost"
              className="dark:bg-zinc-700 dark:text-white"
            >
              Colleges
            </Button>
          </Link>
          <Link to="/events">
            <Button
              variant="ghost"
              className="dark:bg-zinc-700 dark:text-white"
            >
              Events
            </Button>
          </Link>
          <Link to="/teams">
            <Button
              variant="ghost"
              className="dark:bg-zinc-700 dark:text-white"
            >
              Teams
            </Button>
          </Link>
        </div>

        {/* Right Section with Profile/Sign In Links */}
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {isSignedIn ? (
            <>
              <Link to="/profile">
                <Button>Profile</Button>
              </Link>
              {/* <ModeToggle /> */}
            </>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/signup" className="mr-2">
                <Button>Sign Up</Button>
              </Link>
              {/* <ModeToggle /> */}
            </div>
          )}
        </div>

        {/* Sign In / Sign Up Links on Medium Screens */}
      </div>

      {/* Mobile Hamburger Menu */}
      <div
        className={`md:hidden fixed mr-2 top-0 left-0 w-full h-screen bg-white dark:bg-black flex flex-col items-center justify-center space-y-8 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {
          token ?
          <div className="flex flex-col gap-5 w-full p-2 mt-16">
          <Link to="/">
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Home
            </Button>
          </Link>
          <Link to="/colleges">
            <Button variant="outline" className="w-full">
              Colleges
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="outline" className="w-full">
              Events
            </Button>
          </Link>
          <Link to="/teams">
            <Button variant="outline" className="w-full">
              Teams
            </Button>
          </Link>
        </div>
            :
            <div className="flex flex-col gap-5 w-full p-2 mt-16">
              <Link to="/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Home
                </Button>
              </Link>
              <Link to="/colleges">
                <Button variant="outline" className="w-full">
                  Colleges
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" className="w-full">
                  Events
                </Button>
              </Link>
              <Link to="/teams">
                <Button variant="outline" className="w-full">
                  Teams
                </Button>
              </Link>
            </div>
            

        }

      </div>
    </nav>
  );
}

export default Header;
