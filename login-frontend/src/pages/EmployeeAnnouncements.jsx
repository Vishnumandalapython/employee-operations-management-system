import { useEffect, useState } from "react";
import api from "../api/api";
import "./EmployeeAnnouncements.css";

function EmployeeAnnouncements() {

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnnouncements = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/posts");

            const data = response.data;

            if (Array.isArray(data)) {
                setAnnouncements(data);
            } else if (Array.isArray(data.posts)) {
                setAnnouncements(data.posts);
            } else {
                setAnnouncements([]);
            }

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load announcements"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (

        <div className="employee-announcements-page">

            <div className="employee-announcements-header">

                <div>

                    <p className="announcement-eyebrow">
                        EMPLOYEE PORTAL
                    </p>

                    <h1>Announcements</h1>

                    <p>
                        Stay updated with the latest company announcements
                        and internal notices.
                    </p>

                </div>

                <button
                    className="announcement-refresh-btn"
                    onClick={fetchAnnouncements}
                >
                    ↻ Refresh
                </button>

            </div>


            {loading && (

                <div className="announcement-state">

                    <div className="announcement-loader"></div>

                    <p>Loading announcements...</p>

                </div>

            )}


            {!loading && error && (

                <div className="announcement-state error">

                    <span>!</span>

                    <h3>Unable to load announcements</h3>

                    <p>{error}</p>

                    <button onClick={fetchAnnouncements}>
                        Try Again
                    </button>

                </div>

            )}


            {!loading &&
                !error &&
                announcements.length === 0 && (

                    <div className="announcement-state">

                        <span>◈</span>

                        <h3>No announcements</h3>

                        <p>
                            There are no announcements available at the moment.
                        </p>

                    </div>

                )}


            {!loading &&
                !error &&
                announcements.length > 0 && (

                    <div className="announcement-list">

                        {announcements.map((announcement) => (

                            <article
                                className="announcement-card"
                                key={announcement.id}
                            >

                                <div className="announcement-icon">
                                    ◈
                                </div>

                                <div className="announcement-content">

                                    <div className="announcement-card-top">

                                        <h2>
                                            {announcement.title}
                                        </h2>

                                        <span>
                                            Announcement
                                        </span>

                                    </div>

                                    <p>
                                        {announcement.body}
                                    </p>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

        </div>
    );
}

export default EmployeeAnnouncements;