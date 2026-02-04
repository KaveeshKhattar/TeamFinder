import { useState } from "react";
import { useAuth } from "../../core/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "../../../components/modeToggle";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnProfilePage = location.pathname === "/profile";

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
    <nav className="flex items-center w-full max-w-5xl mx-auto p-3 sm:p-4">
      {/* Wrapper for all content */}
      <div className="flex items-center justify-between w-full">
        {/* Left Section with Logo */}
        <div className="flex items-center">
          <button
            className="z-50 text-base sm:text-lg px-3 py-2.5 sm:px-4 sm:py-3 mr-2 md:hidden rounded-md bg-background hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
          <h2>
            <Link to="/launch">
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                TeamFinder
              </span>
            </Link>
          </h2>
        </div>

        {/* Centered Links for Medium and Above */}
        

        {/* Right Section with Profile/Sign In Links */}
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {isSignedIn && !isOnProfilePage && (
            <Link to="/profile">
              <Button size="sm" className="hidden sm:inline-flex">Profile</Button>
            </Link>
          )}

          {isSignedIn && isOnProfilePage && (
            <Button onClick={handleSignOut} variant="destructive" size="sm" className="hidden sm:inline-flex">
              Sign Out
            </Button>
          )}

          {!isSignedIn && (
            <Link to="/signup">
              <Button size="sm" className="hidden sm:inline-flex">Sign Up</Button>
            </Link>
          )}
        </div>

        {/* Sign In / Sign Up Links on Medium Screens */}
      </div>

      {/* Mobile Hamburger Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-background flex flex-col items-center justify-center space-y-4 sm:space-y-6 transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {
          token ?
            <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-xs px-4">
              {isSignedIn  && (
                <Button variant="destructive" className="w-full min-h-[44px]" onClick={handleSignOut}>
                  Sign Out
                </Button>
              )}
              <Link to="/profile" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full min-h-[44px]">
                <p className="dark:text-white">Profile</p>
                </Button>
              </Link>
              <Link to="/show-interest" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full min-h-[44px] underline">
                <p className="dark:text-white">Show your interest</p>
                </Button>
              </Link>
              <Link to="/find-teammates" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full min-h-[44px] underline">
                <p className="dark:text-white">Find your next teammate</p>
                </Button>
              </Link>
              <Link to="/post-your-team" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full min-h-[44px] underline">
                <p className="dark:text-white">Post your team</p>
                </Button>
              </Link>
              <Link to="/find-team" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full min-h-[44px] underline">
              <p className="dark:text-white">Find your next team</p>
                </Button>
              </Link>
            </div>
            :
            <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-xs px-4">
              <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full">
                <Button className="w-full min-h-[44px]">Sign Up</Button>
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full min-h-[44px]">
                  <p>Sign In</p>
                </Button>
              </Link>
              <Link to="/show-interest" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full min-h-[44px] underline">
                <p className="dark:text-white">Show your interest</p>
                </Button>
              </Link>
              <Link to="/find-teammates" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full min-h-[44px] underline">
                <p className="dark:text-white">Find your next teammate</p>
                </Button>
              </Link>
              <Link to="/post-your-team" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full min-h-[44px] underline">
                <p className="dark:text-white">Post your team</p>
                </Button>
              </Link>
              <Link to="/find-team" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="outline" className="w-full min-h-[44px] underline">
              <p className="dark:text-white">Find your next team</p>
                </Button>
              </Link>
            </div>
        }
      </div>
    </nav>
  );
}

export default Header;
