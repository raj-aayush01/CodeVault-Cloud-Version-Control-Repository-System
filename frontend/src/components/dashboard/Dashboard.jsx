import React, {useState, useEffect } from 'react';
import axios from 'axios';

import './Dashboard.css' ;
import Navbar from "../Navbar.jsx"

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/repo/user/${userId}`);

                setRepositories(response.data.repositories);
                console.log(response.data);

            } catch( err ) {
                console.error("Error while fetching repositories: " , err);
            }
        }


        const fetchSuggestedRepositories = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/repo/all`);

                setSuggestedRepositories(response.data);
                console.log(response.data);

            } catch( err ) {
                console.error("Error while fetching repositories: " , err);
            }
        }

        fetchRepositories();
        fetchSuggestedRepositories();

    }, [] );


    useEffect( () => {
        if(searchQuery === ''){
            setSearchResults(repositories);
        } else {
            const filteredRepo = repositories.filter( (repo) => 
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setSearchResults(filteredRepo);
        }

    }, [searchQuery, repositories ] );


    return (
        <>
        <Navbar />

        <section id="dashboard">

            <aside className="left-sidebar">
                <div className="sidebar-panel">
                    <h3>Suggested Repositories</h3>
                    {suggestedRepositories.map((repo) => (
                        <div key={repo._id} className="repo-card small">
                            <h4>{repo.name}</h4>
                            <p>{repo.description}</p>
                        </div>
                    ))}
                </div>
            </aside>


            <main className="main-content">
                <h2>Your Repositories</h2>

                <div className="search-wrapper">
                    <span className="search-icon">⌕</span>
                    <input
                        className="search-input"
                        type="text"
                        value={searchQuery}
                        placeholder="Find a repository..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {searchResults.map( (repo) => {
                    return(
                        <div key={repo._id} className="repo-card">
                            <h4>{repo.name}</h4>
                            <p>{repo.description}</p>
                        </div>
                    )

                })}
            </main>

            <aside className="right-sidebar">
                <h3>Upcoming Events</h3>
                <ul className="events-list">
                    <li><div><p>Tech Conference</p><p className="event-date">Dec 15</p></div></li>
                    <li><div><p>Developer Meetup</p><p className="event-date">Dec 25</p></div></li>
                    <li><div><p>React Summit</p><p className="event-date">Jan 05</p></div></li>
                </ul>
            </aside>
        </section>

        </>
    );
}

export default Dashboard;