import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, List, ListItem, ListItemText } from '@material-ui/core';

const QuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:1337/qnas/index');
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // 데이터 로깅
                setQuestions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <div style={styles.container}>
            <Head>
                <title>Questions</title>
            </Head>
            <h1 style={styles.title}>Questions</h1>
            {loading && <div style={styles.loading}>Loading...</div>}
            {error && <div style={styles.error}>Error: {error}</div>}
            {!loading && !error && questions.length > 0 ? (
                <List>
                    {questions.map((question) => (
                        <ListItem key={question.id} style={styles.listItem}>
                            <ListItemText
                                primary={question.title}
                                secondary={`Content: ${question.content} | User: ${question.user.username} | Email: ${question.user.email}`}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <p style={styles.noQuestions}>No questions found</p>
            )}
            <div style={styles.buttonContainer}>
                <Button variant="contained" color="primary" onClick={() => window.location.href = '/'}>
                    Go to Main Page
                </Button>
            </div>
        </div>
    );
};

// 인라인 스타일링
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
    listItem: {
        marginBottom: '10px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
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
    noQuestions: {
        fontSize: '1.2em',
        color: '#888',
    },
    buttonContainer: {
        textAlign: 'center',
        marginTop: '20px',
    },
};

export default QuestionsPage;
