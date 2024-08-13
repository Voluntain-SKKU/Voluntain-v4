import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/CreateQuestion.module.css';
import Hstyles from '../../styles/Home.module.css';
import { url } from '../../config/next.config'

const CreateQuestionPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState('');
    const [titleError, setTitleError] = useState('');
    const router = useRouter();
    const contentRef = useRef(null);

    const TITLE_MAX_LENGTH = 50; // Set the maximum title length

    useEffect(() => {
        // Fetch the list of lectures
        const fetchLectures = async () => {
            try {
                const response = await fetch(`${url}/lectures`);
                const data = await response.json();
                setLectures(data);
            } catch (error) {
                console.error('Failed to fetch lectures:', error);
            }
        };

        fetchLectures();
    }, []);

    useEffect(() => {
        // Auto-resize the textarea height based on its content
        if (contentRef.current) {
            contentRef.current.style.height = 'auto';
            contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
        }
    }, [content]);

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length > TITLE_MAX_LENGTH) {
            setTitleError(`Title cannot exceed ${TITLE_MAX_LENGTH} characters.`);
        } else {
            setTitleError('');
        }
        setTitle(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (title.length > TITLE_MAX_LENGTH) {
            setTitleError(`Title cannot exceed ${TITLE_MAX_LENGTH} characters.`);
            return;
        }

        const userData = localStorage.getItem('user');
        console.log(userData);
        const user = userData ? JSON.parse(userData) : null;

        if (!user || !user.user.id) {
            alert("You must be logged in to submit a question.");
            return;
        }

        try {
            const response = await fetch(`${url}/qnas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    auth: user.user.id, // Use the logged-in user's ID
                    lecture: selectedLecture || null, // Include the selected lecture, or null if "etc" is chosen
                }),
            });

            if (response.ok) {
                const data = await response.json();
                router.push(`/questions/${data.id}`);
            } else {
                throw new Error('Failed to create question');
            }
        } catch (error) {
            console.error('Error creating question:', error);
            alert(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Create a New Question</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="title" className={styles.formLabel}>Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    className={styles.input}
                />
                {titleError && <p className={styles.error}>{titleError}</p>}
                <label htmlFor="content" className={styles.formLabel}>Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    ref={contentRef}
                    required
                    className={styles.textarea}
                />
                <label htmlFor="lecture" className={styles.formLabel}>Related Lecture:</label>
                <select
                    id="lecture"
                    value={selectedLecture}
                    onChange={(e) => setSelectedLecture(e.target.value)}
                    className={styles.select}
                >
                    <option value="">etc</option> {/* Default etc option */}
                    {lectures.map((lecture) => (
                        <option key={lecture.id} value={lecture.id}>
                            {lecture.title}
                        </option>
                    ))}
                </select>
                <button type="submit" className={Hstyles.myButton} disabled={!!titleError}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateQuestionPage;
