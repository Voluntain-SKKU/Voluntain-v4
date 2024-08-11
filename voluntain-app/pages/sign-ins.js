import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Divider } from '@material-ui/core';
import { useAuth } from '../src/context/AuthContext';
import styles from '../styles/Home.module.css';

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth(); // login 함수를 사용하여 로그인 상태 업데이트

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData = {
      email: formData.get('email'), // 사용자 이메일
      password: formData.get('password'), // 사용자 패스워드
    };

    // 로그인 API 요청
    const response = await fetch('http://localhost:1337/auths/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful', data);
      // 로그인 상태 업데이트 시 username도 포함하여 업데이트
      const updatedUserData = {
        email: userData.email,
        username: data.username, // API 응답에서 username 추출
        ...data // 기타 필요한 데이터가 있다면 추가
      };
      login(updatedUserData); // AuthContext에서 로그인 상태 관리
      localStorage.setItem('user', JSON.stringify(updatedUserData)); // 로컬 스토리지에 저장
      router.push('/'); // 성공 시 홈 페이지로 리디렉션
    } else {
      console.error('Login failed', data.message);
      // 실패 처리 로직 (예: 에러 메시지 표시)
    }
  };

  return (
    <div className={styles.container} style={{height: '100vh'}}>
      <Head>
        <title>Sign In - Voluntain</title>
      </Head>
      <main className={styles.main}>
        <Typography component="h2" variant="h3" align="center" color="textPrimary" style={{ marginTop: '50px' }}>
          Sign In
        </Typography>
        <Divider style={{ margin: 15, width: '5%', background: '#ffffff', borderTop: 'thin solid black' }} />
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Log in to your account
        </Typography>
        
        <form style={{ maxWidth: 500, margin: 'auto' }} onSubmit={handleSubmit}>
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
            Sign In
          </Button>
        </form>
      </main>
    </div>
  );
}
