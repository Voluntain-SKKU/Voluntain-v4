import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useCookies } from 'react-cookie';
import Router from 'next/router';
import { Button } from '@material-ui/core';

const QuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies, setCookie] = useCookies(['lastQuestionViewed']);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/qnas/data`; // 새로운 API 엔드포인트
                console.log(apiUrl); // API URL 확인
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                const data = await response.json();
                console.log(data); // API 응답 확인
                setQuestions(data); // 데이터 설정
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleQuestionClick = (questionId) => {
        setCookie('lastQuestionViewed', questionId, { path: '/', maxAge: 31536000 });
        Router.push(`/questions/${questionId}`);
    };

    return (
        <div style={styles.container}>
            <Head>
                <title>Questions</title>
            </Head>
            <h1 style={styles.title}>Questions</h1>
            {loading && <div style={styles.loading}>Loading...</div>}
            {error && <div style={styles.error}>Error: {error}</div>}
            {!loading && !error && questions.length > 0 ? (
                questions.map((question) => (
                    <div key={question.id} style={styles.questionCard}>
                        <div onClick={() => handleQuestionClick(question.id)} style={styles.link}>
                            <h2 style={styles.questionTitle}>{question.title}</h2>
                            <p style={styles.questionContent}>{question.content}</p>
                        </div>
                    </div>
                ))
            ) : (
                !loading && !error && <p style={styles.noQuestions}>No questions found</p>
            )}
            <div style={styles.buttonContainer}>
                <Button variant="contained" color="primary" onClick={() => Router.push('/')}>
                    Go to Main Page
                </Button>
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2em',
        marginBottom: '20px',
    },
    questionCard: {
        padding: '20px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    questionCardHover: {
        backgroundColor: '#e9e9e9',
    },
    questionTitle: {
        fontSize: '1.5em',
        margin: '0 0 10px',
    },
    questionContent: {
        fontSize: '1em',
        color: '#555',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    noQuestions: {
        fontSize: '1.2em',
        color: '#888',
    },
    loading: {
        fontSize: '1.5em',
        textAlign: 'center',
        marginTop: '20px',
    },
    error: {
        fontSize: '1.5em',
        textAlign: 'center',
        marginTop: '20px',
        color: 'red',
    },
    buttonContainer: {
        textAlign: 'center',
        marginTop: '20px',
    },
};

export default QuestionsPage;
