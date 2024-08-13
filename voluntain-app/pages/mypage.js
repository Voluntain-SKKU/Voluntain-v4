import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Divider, FormControl, InputLabel, Input } from '@material-ui/core';
import styles from '../styles/Home.module.css';

export default function MyPage() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        school: '',
        country: '',
        grade: ''
    });
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const { id } = JSON.parse(userData);
            fetchUserData(id);
        } else {
            router.push('/sign-ins'); // Redirect to sign-in page if not logged in
        }
    }, []);

    const fetchUserData = async (userId) => {
        try {
            const response = await fetch(`http://localhost:1337/auths/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setUser(data);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const { username, email, school, country, grade } = user;
        try {
            const response = await fetch(`http://localhost:1337/auths/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ school, country, grade }),
            });
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert(error.message);
        }
    };

    return (
        <div className={styles.myWrapper}>
            <div className={styles.myContainer}>
                <Head>
                    <title>My Profile</title>
                </Head>
                <Typography
                    variant="h5"
                    gutterBottom
                    style={{
                        fontFamily: 'Black Han Sans, sans-serif',
                        marginBottom: "20px",
                        color: 'white',
                        textShadow: 'inset -4px -4px 5px rgba(0,0,0,0.8), inset 4px 4px 5px rgba(255,255,255,0.5)'
                    }}
                >
                    Voluntain Student ID Card
                </Typography>
                <Divider style={{ color: 'white', margin: 10, width: '5%', background: '#ffffff', borderTop: 'thin solid white' }} />
                <form className={styles.myForm}>
                    {['username', 'email', 'school', 'country', 'grade'].map(field => (
                        <div className={styles.myGroup} key={field}>
                            <label htmlFor={field} className={styles.myLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                id={field}
                                type={field === 'email' ? 'email' : (field === 'grade' ? 'number' : 'text')}
                                className={styles.myInput}
                                name={field}
                                value={user[field]}
                                onChange={handleChange}
                                disabled={field === 'username' || field === 'email'}
                                onKeyDown={(e) => {
                                    if (field === 'grade') {
                                        e.preventDefault();
                                    }
                                }}
                                min="0"
                                max="12"
                                step="1"
                            />
                        </div>
                    ))}
                    <div className={styles.group}>
                        <input type="submit" className={styles.myButton} onClick={handleSave} value="Save Changes" />
                    </div>
                </form>
            </div>
        </div>
    );
}
