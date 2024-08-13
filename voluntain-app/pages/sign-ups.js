import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import styles from '../styles/Home.module.css'
import Typography from '@material-ui/core/Typography';
import { TextField, Button, Divider } from '@material-ui/core';
import bcrypt from 'bcryptjs';
import { url } from '../config/next.config'

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, email, password, repeatPassword } = formData;

    if (!username || !email || !password || password !== repeatPassword) {
      alert('Please check your inputs');
      return;
    }

    if (password !== repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const checkEmailResponse = await fetch(`${url}/auths/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const emailData = await checkEmailResponse.json();
      if (!checkEmailResponse.ok) {
        alert('Email already exists');
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const signUpResponse = await fetch(`${url}/auths/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password: hashedPassword }),
      });

      if (signUpResponse.ok) {
        const signUpData = await signUpResponse.json();
        const userData = {
          id: signUpData.id,
          username: signUpData.username,
          email: signUpData.email
        };
        login(userData);
        router.push('/');
      } else {
        alert('Failed to sign up');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className={styles.loginWrap}>
      <Head>
        <title>Sign Up</title>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap" rel="stylesheet" />
      </Head>
      <div className={styles.loginHtml}>
        <div className="login-form">
          <div className={styles.signUpHtm}>
            <Typography component="h3" variant="h4" color="white" style={{ marginTop: '30px', color: 'white' }}>
              Sign Up
            </Typography>
            <Divider align= "center" style={{ color: 'white', margin: 10, width: '5%', background: '#ffffff', borderTop: 'thin solid white' }} />
            <Typography variant="h6" style={{ color: 'white', marginBottom: 30}} paragraph>
              Create your account to join our community!
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className={styles.group}>
                <label htmlFor="username" className={styles.label}>Username</label>
                <input id="username" type="text" className={styles.input} name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div className={styles.group}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input id="email" type="email" className={styles.input} name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className={styles.group}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input id="password" type="password" className={styles.input} data-type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>
              <div className={styles.group}>
                <label htmlFor="repeat-password" className={styles.label}>Repeat Password</label>
                <input id="repeat-password" type="password" className={styles.input} data-type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} />
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
