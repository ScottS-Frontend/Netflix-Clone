import React, { useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase";

const Navbar = () => {
  const navRef = useRef();
  const navigate = useNavigate();

  async function handleSignOut() {
    localStorage.removeItem("demoUser");

    try {
      await logout();
    } catch (err) {
      console.log("Firebase signout skipped:", err);
    }

    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const handleScroll = () => {
      const el = navRef.current;
      if (!el) return;

      if (window.scrollY >= 80) {
        el.classList.add("nav-dark");
      } else {
        el.classList.remove("nav-dark");
      }
    };
    
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="" />
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={search_icon} alt="" className="icons" />
        <p>Children</p>
        <img src={bell_icon} alt="" className="icons" />
        <div className="navbar-profile">
          <img src={profile_img} alt="" className="profile" />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={handleSignOut}>Sign out of Netflix</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
