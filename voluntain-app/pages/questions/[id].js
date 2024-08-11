import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';

const QuestionDetail = () => {
    const [question, setQuestion] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:1337/qnas/${id}`)
                .then(response => response.json())
                .then(data => setQuestion(data))
                .catch(error => console.error('Error fetching question:', error));
        }
    }, [id]);

    return (
        <div className={styles.container}>
            {question ? (
                <>
                    <h1>{question.title}</h1>
                    <p>{question.content}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default QuestionDetail;
