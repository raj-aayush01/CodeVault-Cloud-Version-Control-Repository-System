import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../AuthContext";

/* ── SVG Icons ─────────────────────────────────────── */
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
  </svg>
);

const RepoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="#8b949e">
    <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z" />
  </svg>
);

const SignOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#f85149">
    <path d="M2 2.75C2 1.784 2.784 1 3.75 1h5.5a.75.75 0 0 1 0 1.5h-5.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h5.5a.75.75 0 0 1 0 1.5h-5.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .744.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.744l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z" />
  </svg>
);

/* ── Component ──────────────────────────────────────── */
const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details:", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  const initials = userDetails.username
    ? userDetails.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="profile-root">
      <Navbar />

      {/* TAB NAV */}
      <div className="profile-tab-nav">
        <button
          className={`profile-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <BookIcon />
          Overview
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "starred" ? "active" : ""}`}
          onClick={() => { setActiveTab("starred"); navigate("/repo"); }}
        >
          <RepoIcon />
          Starred Repositories
        </button>
      </div>

      {/* PAGE LAYOUT */}
      <div className="profile-layout">

        {/* SIDEBAR */}
        <aside className="profile-sidebar">

          {/* Avatar */}
          <div className="avatar-wrap">
            <div className="avatar-circle">
              <span className="avatar-initials">{initials}</span>
            </div>
            <span className="avatar-online-dot" />
          </div>

          {/* Name */}
          <h2 className="profile-display-name">{userDetails.username}</h2>
          <p className="profile-handle">@{userDetails.username?.toLowerCase()}</p>
          <p className="profile-bio">No bio yet.</p>

          {/* Follow */}
          <button className="profile-follow-btn">Follow</button>

          <hr className="profile-divider" />

          {/* Stats */}
          <div className="profile-stats">
            <PeopleIcon />
            <span><strong>10</strong> followers</span>
            <span className="profile-stats-sep">·</span>
            <span><strong>3</strong> following</span>
          </div>

          <hr className="profile-divider" />

          {/* Sign out */}
          <button className="profile-signout-btn" onClick={handleLogout}>
            <SignOutIcon />
            Sign out
          </button>

        </aside>

        {/* MAIN */}
        <main className="profile-main">
          <div className="contributions-card">
            <div className="contributions-card-header">
              {/* <span className="contributions-card-title">Recent Contributions</span> */}
              <span className="contributions-card-badge">Last 3 months</span>
            </div>
            <HeatMapProfile />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Profile;
