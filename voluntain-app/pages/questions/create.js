import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Home.module.css';
import { url } from '../../config/next.config'

const CreateQuestionPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        if (!user || !user.id) {
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
                    auth: user.id // 실제 애플리케이션에서는 로그인한 사용자의 ID를 사용
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
            <h1>Create a New Question</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateQuestionPage;
