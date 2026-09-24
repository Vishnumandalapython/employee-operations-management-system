import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchPosts,
    createPost,
    updatePost,
    deletePost
} from "../redux/postsSlice";

import "./Posts.css";


function Posts() {

    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);

    // ===============================
    // REDUX STATE
    // ===============================

    const {
        posts,
        loading,
        error,
        totalPages,
        totalPosts
    } = useSelector(
        (state) => state.posts
    );


    // ===============================
    // CREATE ANNOUNCEMENT STATE
    // ===============================

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");


    // ===============================
    // EDIT ANNOUNCEMENT STATE
    // ===============================

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");


    // ===============================
    // POSTS PER PAGE
    // ===============================

    const postsPerPage = 10;


    // ===============================
    // FETCH ANNOUNCEMENTS
    // ===============================

    useEffect(() => {

        dispatch(
            fetchPosts({
                page: currentPage,
                limit: postsPerPage
            })
        );

    }, [dispatch, currentPage]);


    // ===============================
    // CREATE ANNOUNCEMENT
    // ===============================

    const handleCreatePost = async () => {

        if (!title.trim() || !body.trim()) {

            alert(
                "Announcement title and content are required"
            );

            return;
        }


        try {

            await dispatch(
                createPost({
                    title,
                    body
                })
            ).unwrap();


            setTitle("");
            setBody("");


            dispatch(
                fetchPosts({
                    page: currentPage,
                    limit: postsPerPage
                })
            );


        } catch (error) {

            alert(error);

        }

    };


    // ===============================
    // START EDIT
    // ===============================

    const handleEdit = (post) => {

        setEditId(post.id);

        setEditTitle(post.title);

        setEditBody(post.body);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ===============================
    // UPDATE ANNOUNCEMENT
    // ===============================

    const handleUpdatePost = async () => {

        if (
            !editTitle.trim() ||
            !editBody.trim()
        ) {

            alert(
                "Announcement title and content are required"
            );

            return;
        }


        try {

            await dispatch(
                updatePost({
                    id: editId,
                    title: editTitle,
                    body: editBody
                })
            ).unwrap();


            setEditId(null);

            setEditTitle("");

            setEditBody("");


            dispatch(
                fetchPosts({
                    page: currentPage,
                    limit: postsPerPage
                })
            );


        } catch (error) {

            alert(error);

        }

    };


    // ===============================
    // DELETE ANNOUNCEMENT
    // ===============================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this announcement?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            await dispatch(
                deletePost(id)
            ).unwrap();


            dispatch(
                fetchPosts({
                    page: currentPage,
                    limit: postsPerPage
                })
            );


        } catch (error) {

            alert(error);

        }

    };


    // ===============================
    // CANCEL EDIT
    // ===============================

    const handleCancelEdit = () => {

        setEditId(null);

        setEditTitle("");

        setEditBody("");

    };


    // ===============================
    // PAGE CHANGE
    // ===============================

    const handlePageChange = (pageNumber) => {

        setCurrentPage(pageNumber);

    };


    // ===============================
    // PREVIOUS
    // ===============================

    const handlePrevious = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );

        }

    };
    // ==============================
    // NEXT
    // ===============================
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(
                currentPage + 1
            );
        }
    };
    // ===============================
    // UI
    // ==============================
    return (
        <div className="announcements-page">
            {/* =================================
                PAGE HEADER
            =============================== */}
            <div className="announcements-header">
                <div>
                    <div className="page-eyebrow">
                        COMMUNICATION
                    </div>
                    <h1 className="announcements-title">
                        Announcements
                    </h1>
                    <p className="announcements-subtitle">
                        Share important updates and
                        internal information with employees.
                    </p>
                </div>
                <div className="announcement-count">
                    <span className="count-number">
                        {totalPosts}
                    </span>
                    <span className="count-label">
                        Total Announcements
                    </span>
                </div>
            </div>
            {/* =================================
                ERROR
            ================================= */}
            {error && (

                <div className="announcement-error">

                    <span className="error-icon">
                        !
                    </span>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =================================
                CREATE / EDIT CARD
            ================================= */}

            <div className="announcement-form-card">


                <div className="form-card-header">

                    <div className="form-icon">
                        {editId ? "✎" : "+"}
                    </div>

                    <div>

                        <h2>
                            {editId
                                ? "Edit Announcement"
                                : "Create Announcement"
                            }
                        </h2>

                        <p>
                            {editId
                                ? "Update the announcement details below."
                                : "Publish an important message for employees."
                            }
                        </p>

                    </div>

                </div>


                <div className="announcement-form">


                    {/* TITLE */}

                    <div className="announcement-field">

                        <label htmlFor="announcement-title">
                            Announcement Title
                        </label>

                        <input
                            id="announcement-title"
                            type="text"
                            placeholder="Enter announcement title"
                            value={
                                editId
                                    ? editTitle
                                    : title
                            }
                            onChange={(e) => {

                                if (editId) {

                                    setEditTitle(
                                        e.target.value
                                    );

                                } else {

                                    setTitle(
                                        e.target.value
                                    );

                                }

                            }}
                            disabled={loading}
                        />

                    </div>


                    {/* CONTENT */}

                    <div className="announcement-field">

                        <label htmlFor="announcement-body">
                            Announcement Content
                        </label>

                        <textarea
                            id="announcement-body"
                            placeholder="Write the announcement details..."
                            rows="5"
                            value={
                                editId
                                    ? editBody
                                    : body
                            }
                            onChange={(e) => {

                                if (editId) {

                                    setEditBody(
                                        e.target.value
                                    );

                                } else {

                                    setBody(
                                        e.target.value
                                    );

                                }

                            }}
                            disabled={loading}
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="announcement-form-actions">

                        {editId ? (

                            <>
                                <button
                                    type="button"
                                    className="publish-btn"
                                    onClick={
                                        handleUpdatePost
                                    }
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Updating..."
                                        : "Update Announcement"
                                    }

                                </button>


                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        handleCancelEdit
                                    }
                                    disabled={loading}
                                >

                                    Cancel

                                </button>

                            </>

                        ) : (

                            <button
                                type="button"
                                className="publish-btn"
                                onClick={
                                    handleCreatePost
                                }
                                disabled={loading}
                            >

                                {loading
                                    ? "Publishing..."
                                    : "Publish Announcement"
                                }

                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================
                ANNOUNCEMENT LIST HEADER
            ================================= */}

            <div className="list-header">

                <div>

                    <h2>
                        Recent Announcements
                    </h2>

                    <p>
                        Manage published announcements
                    </p>

                </div>

                <span className="list-count">
                    {totalPosts} announcements
                </span>

            </div>


            {/* =================================
                ANNOUNCEMENTS
            ================================= */}

            <div className="announcement-list">

                {loading && posts.length === 0 ? (

                    <div className="announcement-loading">

                        <div className="loading-spinner"></div>

                        <span>
                            Loading announcements...
                        </span>

                    </div>

                ) : posts.length === 0 ? (

                    <div className="announcement-empty">

                        <div className="empty-icon">
                            📢
                        </div>

                        <h3>
                            No announcements yet
                        </h3>

                        <p>
                            Create your first announcement
                            to share information with employees.
                        </p>

                    </div>

                ) : (

                    posts.map((post) => (

                        <div
                            className="announcement-item"
                            key={post.id}
                        >

                            <div className="announcement-main">

                                <div className="announcement-icon">
                                    📢
                                </div>


                                <div className="announcement-content">

                                    <div className="announcement-item-top">

                                        <span className="announcement-label">
                                            ANNOUNCEMENT
                                        </span>

                                        <span className="announcement-id">
                                            #{post.id}
                                        </span>

                                    </div>


                                    <h3>
                                        {post.title}
                                    </h3>


                                    <p>
                                        {post.body}
                                    </p>

                                </div>

                            </div>


                            <div className="announcement-actions">

                                <button
                                    type="button"
                                    className="edit-btn"
                                    onClick={() =>
                                        handleEdit(post)
                                    }
                                    disabled={loading}
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDelete(post.id)
                                    }
                                    disabled={loading}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>


            {/* =================================
                PAGINATION
            ================================= */}

            {totalPages > 1 && (

                <div className="pagination">


                    <button
                        type="button"
                        className="pagination-btn"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>


                    <div className="page-numbers">

                        {Array.from(
                            {
                                length: totalPages
                            },
                            (_, index) =>
                                index + 1
                        ).map((pageNumber) => (

                            <button
                                type="button"
                                key={pageNumber}
                                className={
                                    currentPage === pageNumber
                                        ? "pagination-btn active"
                                        : "pagination-btn"
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pageNumber
                                    )
                                }
                            >

                                {pageNumber}

                            </button>

                        ))}

                    </div>


                    <button
                        type="button"
                        className="pagination-btn"
                        onClick={handleNext}
                        disabled={
                            currentPage === totalPages
                        }
                    >
                        Next →
                    </button>

                </div>

            )}


            {/* =================================
                FOOTER INFO
            ================================= */}

            <div className="pagination-info">

                <span>
                    Showing page {currentPage}
                </span>

                <span>
                    •
                </span>

                <span>
                    {totalPosts} total announcements
                </span>

            </div>

        </div>

    );

}


export default Posts;