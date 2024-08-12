import React from 'react';
import Link from 'next/link';
import styles from '../../styles/QuestionIndex.module.css';

export async function getStaticProps() {
    try {
        const response = await fetch('http://localhost:1337/qnas/index');
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
            <h1 className={styles.questionsHeader}>Questions</h1>
            <ul className={styles.questionList}>
                {questions.map((question) => (
                    <li key={question.id} className={styles.questionItem}>
                        <Link href={`/questions/${question.id}`}>
                            <a>
                                <h2>{question.title}</h2>
                                <p>{question.content}</p>
                                <small>Author: {question.user ? question.user.username : 'Unknown'}</small>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
