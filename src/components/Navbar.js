import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import "./style/navbar.css";

function Navbar() {
  const { user } = useUser();
  const userName =
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showLinks, setShowLinks] = useState(false);

  // Track window width for responsiveness
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu on navigation/search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    setShowLinks(false);
  };

  const isMobile = windowWidth <= 700;

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-row">
        
        {/* Leftmost group: brand + nav */}
        <div className="navbar-left">
          <Link to="/" className="navbar-brand" aria-label="Home">
            <img
              src="/logo.avif"
              alt="Brand Logo"
              className="navbar-logo"
              loading="lazy"
            />
            <span className="navbar-brand-name">Anvaya</span>
          </Link>

          {/* Desktop nav links */}
          {!isMobile && (
            <div className="nav-links">
              <Link to="/postcard" className="nav-link">Post</Link>
              <Link to="/contact" className="nav-link">About us</Link>
              <Link to="/mylist" className="nav-link">My List</Link>
            </div>
          )}

          {/* Hamburger toggle for mobile */}
          {isMobile && (
            <button
              className="navbar-toggle"
              aria-label="Toggle menu"
              onClick={() => setShowLinks(!showLinks)}
              aria-expanded={showLinks}
            >
              &#9776;
            </button>
          )}
        </div>

        {/* Rightmost group: search + button + user info */}
        <div className="navbar-right">
          <form
            className="search-form"
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Search scratch cards"
          >
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search scratch cards"
              name="search"
              autoComplete="off"
              className="search-input"
            />
          </form>

          {/* Search button now separate */}
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="search-button"
            aria-label="Submit search"
          >
            Search
          </button>

          {/* User info */}
          <UserButton
            showName={false}
            appearance={{ variables: { colorPrimary: "#bb86fc" } }}
          />
          
          {/* Username hides only on smallest screens */}
          <span className="navbar-username">{userName}</span>
        </div>
      </div>

      {/* Mobile nav links dropdown */}
      {isMobile && (
        <div className={`nav-links-mobile ${showLinks ? "show" : ""}`}>
          <Link
            to="/postcard"
            className="nav-link"
            onClick={() => setShowLinks(false)}
          >
            Post
          </Link>
          <Link
            to="/contact"
            className="nav-link"
            onClick={() => setShowLinks(false)}
          >
            About us
          </Link>
          <Link
            to="/mylist"
            className="nav-link"
            onClick={() => setShowLinks(false)}
          >
            My List
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
