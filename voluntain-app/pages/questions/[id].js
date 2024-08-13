import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Question.module.css';
import Hstyles from '../../styles/Home.module.css';
import { url } from '../../config/next.config'

const QuestionDetail = () => {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState('');
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetch(`${url}/qnas/${id}`)
                .then(response => response.json())
                .then(data => setQuestion(data))
                .catch(error => console.error('Error fetching question:', error));

            fetch(`${url}/answers/qna/${id}`)
                .then(response => response.json())
                .then(data => setAnswers(data))
                .catch(error => console.error('Error fetching answers:', error));
        }
    }, [id]);

    const handleAnswerSubmit = (e) => {
        e.preventDefault();

        if (newAnswer.trim() === '') {
            alert('Answer cannot be empty');
            return;
        }

        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        if (!user || !user.id) {
            alert("You must be logged in to submit an answer.");
            return;
        }

        fetch(`${url}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newAnswer,
                qna: id,
                user: user.id, // 실제 사용자 ID로 대체해야 합니다.
            }),
        })
            .then(response => response.json())
            .then(data => {
                setAnswers([...answers, data]);
                setNewAnswer('');
            })
            .catch(error => console.error('Error posting answer:', error));
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className={styles.container}>
            {question ? (
                <>
                    <div className={styles.questionContainer}>
                        <h1 className={styles.questionTitle}>{question.title}</h1>
                        <div className={styles.questionContent}>{question.content}</div>
                        <div className={styles.questionMeta}>
                            <p>Asked by: {question.user?.username}</p>
                            <p>Date: {formatDate(question.updated_at)}</p> {/* Use updated_at here */}
                        </div>
                    </div>
                    <div className={styles.answersContainer}>
                        <h2>Answers</h2>
                        {answers.length > 0 ? (
                            answers.map((answer) => (
                                <div key={answer.id} className={styles.answer}>
                                    <p>{answer.content}</p>
                                    <div className={styles.answerMeta}>
                                        <p>Answered by: {answer.user?.username}</p>
                                        <p>Date: {formatDate(answer.updated_at)}</p> {/* Use updated_at here */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No answers yet.</p>
                        )}
                    </div>
                    <div className={styles.answerFormContainer}>
                        <h3>Submit Your Answer</h3>
                        <form onSubmit={handleAnswerSubmit}>
                            <textarea
                                className={styles.answerInput}
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="Write your answer here..."
                            />
                            <button type="submit" className={Hstyles.myButton}>
                                Submit Answer
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default QuestionDetail;
