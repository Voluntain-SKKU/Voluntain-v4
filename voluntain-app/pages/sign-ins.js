import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import styles from '../styles/Home.module.css';
import Typography from '@material-ui/core/Typography';
import { TextField, Button, Divider } from '@material-ui/core';
import { url } from '../config/next.config'

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      alert('Both email and password are required');
      return;
    }

    try {
      const response = await fetch(`${url}/auths/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data); // Assuming `login` function takes the user data directly
        localStorage.setItem('user', JSON.stringify(data)); // Storing user data in localStorage
        router.push('/'); // Redirect to home on success
      } else {
        console.error('Login failed', data.message);
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Network error', error);
      alert('Network error');
    }
  };

  return (
    <div className={styles.loginWrap2}>
      <Head>
        <title>Sign In - Voluntain</title>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap" rel="stylesheet" />
      </Head>
      <div className={styles.loginHtml}>
        <div className="login-form">
          <div className={styles.signUpHtm}>
            <Typography component="h3" variant="h4" color="white" style={{ marginTop: '30px', color: 'white' }}>
              Sign In
            </Typography>
            <Divider style={{ color: 'white', margin: 10, width: '5%', background: '#ffffff', borderTop: 'thin solid white' }} />
            <Typography variant="h6" style={{ color: 'white', marginBottom: 30 }} paragraph>
              Log in to your account
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className={styles.group}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input id="email" type="email" className={styles.input} name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className={styles.group}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input id="password" type="password" className={styles.input} data-type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>
              <div className={styles.group}>
                <input type="submit" className={styles.button} value="Sign Up" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
