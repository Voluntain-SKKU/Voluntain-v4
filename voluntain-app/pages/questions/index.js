import React from 'react';
import Link from 'next/link';
import styles from '../../styles/QuestionIndex.module.css';
import { url } from '../../config/next.config'

export async function getStaticProps() {
    try {
        const response = await fetch(`${url}/qnas/index`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const questions = await response.json();
        return { props: { questions } };
    } catch (error) {
        return { props: { questions: [], error: error.message } };
    }
}

export default function Questions({ questions, error }) {
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.questionsHeader}>Questions</h1>
                <Link href="/questions/create">
                    <button className={styles.createButton}>Create Post</button>
                </Link>
            </div>
            <ul className={styles.questionList}>
                {questions.map((question) => (
                    <li key={question.id} className={styles.questionItem}>
                        <Link href={`/questions/${question.id}`}>
                            <a onClick={() => handleViewIncrement(question.id)}>
                                <div className={styles.titleRow}>
                                    <h2 className={styles.questionTitle}>{question.title}</h2>
                                    {question.isNew && <span className={styles.newBadge}>NEW</span>}
                                </div>
                                <p className={styles.questionContent}>{question.content}</p>
                                <div className={styles.metaInfo}>
                                    <span>Author: {question.user ? question.user.username : 'Unknown'}</span>
                                    <span>{new Date(question.created_at).toLocaleDateString()}</span>
                                    <span>Views: {question.views || 0}</span>
                                </div>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const handleViewIncrement = async (id) => {
    try {
        await fetch(`http://localhost:1337/qnas/${id}/view`, {
            method: 'GET',
        });
    } catch (error) {
        console.error('Failed to increment views:', error);
    }
};
