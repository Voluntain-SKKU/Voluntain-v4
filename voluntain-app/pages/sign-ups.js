import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Typography from '@material-ui/core/Typography';
import { TextField, Button, Divider } from '@material-ui/core';
import { useRouter } from 'next/router'; // Next.js 라우터 사용
import { useAuth } from '../src/context/AuthContext'; // AuthContext 사용

export default function SignUpPage() {
  const router = useRouter(); // useRouter 훅 사용
  const { login } = useAuth(); // login 함수 가져오기

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // Strapi API로 데이터 전송
    const response = await fetch('http://localhost:1337/auths/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration successful', data);
      login();
      router.push('/'); // useHistory 대신 useRouter의 push 메소드 사용
    } else {
      console.error('Registration failed', data.message);
      // 실패 처리 로직
    }
  };

  return (
    <div className={styles.container} style={{height: '100vh'}}>
      <Head>
        <title>Sign Up - Voluntain</title>
      </Head>
      <main className={styles.main}>
        <Typography component="h2" variant="h3" align="center" color="textPrimary" style={{ marginTop: '50px' }}>
          Sign Up
        </Typography>
        <Divider style={{ margin: 15, width: '5%', background: '#ffffff', borderTop: 'thin solid black' }} />
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Create your account to join our community!
        </Typography>
        
        <form style={{ maxWidth: 500, margin: 'auto' }} onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              style: { fontSize: 12, fontFamily: 'Arial', fontWeight: 'bold', position: 'absolute', top: '-6px'}
            }}
            InputProps={{
              style: { height: 40 }
            }}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              style: { fontSize: 12, fontFamily: 'Arial', fontWeight: 'bold', position: 'absolute', top: '-6px'}
            }}
            InputProps={{
              style: { height: 40 }
            }}
          />
          <TextField
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              style: { fontSize: 12, fontFamily: 'Arial', fontWeight: 'bold', position: 'absolute', top: '-6px'}
            }}
            InputProps={{
              style: { height: 40 }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color= "#0e341b"
            style={{ marginTop: 20, marginBottom: 70, height: 40, background: "#0e341b", color: 'white', fontSize: 18}}
          >
            Sign Up
          </Button>
        </form>
      </main>
    </div>
  );
}
