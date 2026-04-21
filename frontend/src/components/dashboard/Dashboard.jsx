import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Navbar from "../Navbar.jsx";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [starredRepos, setStarredRepos] = useState({});
    const [starCounts, setStarCounts] = useState({});
    const [events, setEvents] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    const userId = localStorage.getItem("userId");

    const userName = userDetails.username || "User";
    const userEmail = userDetails.email || "";
    const avatarLetter = userName.charAt(0).toUpperCase();

    useEffect(() => {

        // TEMP dynamic events
        setEvents([
            { name: "Tech Conference", date: "Dec 15" },
            { name: "Developer Meetup", date: "Dec 25" },
            { name: "React Summit", date: "Jan 05" }
        ]);

        // 🔥 Fetch current user
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/userProfile/${userId}`);
                setUserDetails(res.data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        // 🔥 Fetch user's repos
        const fetchRepositories = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/repo/user/${userId}`);
                setRepositories(res.data.repositories);
            } catch (err) {
                console.error("Error fetching user repos:", err);
            }
        };

        // 🔥 Fetch all repos (for explore)
        const fetchSuggestedRepositories = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/repo/all`);
                setSuggestedRepositories(res.data);

                const counts = {};
                res.data.forEach(repo => {
                    counts[repo._id] = repo.stars || 0;
                });
                setStarCounts(counts);
            } catch (err) {
                console.error("Error fetching all repos:", err);
            }
        };

        fetchUser();
        fetchRepositories();
        fetchSuggestedRepositories();

    }, []);

    // 🔥 ONLY PUBLIC REPOS IN EXPLORE
    const filteredSuggested = suggestedRepositories
        .filter(repo => repo.visibility === true)
        .filter(repo =>
            repo.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleStar = (repoId) => {
        const isStarred = starredRepos[repoId];

        setStarredRepos(prev => ({
            ...prev,
            [repoId]: !isStarred
        }));

        setStarCounts(prev => ({
            ...prev,
            [repoId]: isStarred
                ? Math.max(0, (prev[repoId] || 1) - 1)
                : (prev[repoId] || 0) + 1
        }));
    };

    const handleFollow = async (targetUserId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.patch(
                `http://localhost:3000/follow/${targetUserId}`,
                {}, // no body needed
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedFollowers = res.data.followers;

            setSuggestedRepositories(prev =>
                prev.map(repo => {
                    if (repo.owner?._id === targetUserId) {
                        return {
                            ...repo,
                            owner: {
                                ...repo.owner,
                                followers: updatedFollowers
                            }
                        };
                    }
                    return repo;
                })
            );

        } catch (err) {
            console.error("Follow failed:", err);
        }
    };

    return (
        <>
            <Navbar />

            <section id="dashboard">

                {/* LEFT SIDEBAR */}
                <aside className="left-sidebar">

                    <div className="sidebar-panel profile-panel">
                        <div className="user-profile">
                            <div className="avatar">{avatarLetter}</div>
                            <div>
                                <p className="user-name">{userName}</p>
                                <p className="user-email">{userEmail}</p>
                            </div>
                        </div>

                        <button className="new-repo-btn">+ New Repository</button>
                    </div>

                    <div className="sidebar-panel">
                        <h3>Your Repositories</h3>

                        {repositories.length === 0 && (
                            <p className="empty-msg">No repositories yet.</p>
                        )}

                        {repositories.map((repo) => (
                            <div key={repo._id} className="repo-card small">

                                <div className="small-card-top">
                                    <h4>{repo.name}</h4>

                                    {/* 🔥 FIXED VISIBILITY */}
                                    <span className={`badge ${repo.visibility ? 'badge-public' : 'badge-private'}`}>
                                        {repo.visibility ? 'Public' : 'Private'}
                                    </span>
                                </div>

                                <p>{repo.description}</p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* MAIN */}
                <main className="main-content">

                    <h2>Explore Repositories</h2>

                    <div className="search-wrapper">
                        <span className="search-icon">⌕</span>
                        <input
                            className="search-input"
                            type="text"
                            value={searchQuery}
                            placeholder="Search repositories..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {filteredSuggested.length === 0 && (
                        <p className="empty-msg">No repositories found.</p>
                    )}

                    {filteredSuggested.map((repo) => (
                        <div key={repo._id} className="repo-card">

                            <div className="repo-card-header">

                                <div className="repo-card-info">
                                    <h4>{repo.name}</h4>

                                    <p className="repo-by">
                                        by {repo.owner?.username || "unknown"}
                                    </p>

                                    <p className="repo-desc">{repo.description}</p>

                                    {/* 🔥 FIXED VISIBILITY */}
                                    <span className={`badge ${repo.visibility ? 'badge-public' : 'badge-private'}`}>
                                        {repo.visibility ? 'Public' : 'Private'}
                                    </span>
                                </div>

                                <button
                                    className={`star-btn ${starredRepos[repo._id] ? 'starred' : ''}`}
                                    onClick={() => handleStar(repo._id)}
                                >
                                    <span>{starredRepos[repo._id] ? '★' : '☆'}</span>
                                    <span>{starCounts[repo._id] || 0}</span>
                                </button>

                            </div>
                        </div>
                    ))}
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="right-sidebar">

                    {/* FOLLOW */}
                    <div className="sidebar-panel">
                        <h3>Who to Follow</h3>

                        {suggestedRepositories
                            .map(r => r.owner)
                            .filter((o, i, arr) =>
                                o &&
                                o._id !== userId &&
                                arr.findIndex(x => x?._id === o?._id) === i
                            )
                            .slice(0, 5)
                            .map((owner) => {

                                const isFollowing = owner.followers?.some(
                                    (f) => String(f._id || f) === String(userId)
                                ) || false;

                                return (
                                    <div key={owner._id} className="follow-item">

                                        <div className="follow-avatar">
                                            {owner.username?.charAt(0).toUpperCase()}
                                        </div>

                                        <span className="follow-name">
                                            {owner.username}
                                        </span>

                                        <button
                                            className="follow-btn"
                                            onClick={() => handleFollow(owner._id)}
                                        >
                                            {isFollowing ? "Following" : "Follow"}
                                        </button>

                                    </div>
                                );
                            })}
                    </div>

                    {/* EVENTS */}
                    <div className="sidebar-panel">
                        <h3>Upcoming Events</h3>

                        <ul className="events-list">
                            {events.map((event, index) => (
                                <li key={index}>
                                    <div>
                                        <p>{event.name}</p>
                                        <p className="event-date">{event.date}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </aside>

            </section>
        </>
    );
};

export default Dashboard;