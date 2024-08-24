import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserJSON = localStorage.getItem('user'); // 로컬 스토리지에서 유저 정보를 가져옴
    let storedUser = null;
    if (storedUserJSON) {
      try {
        storedUser = JSON.parse(storedUserJSON); // JSON.parse는 try 블록 내에서 실행
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Parsing 실패 시 에러 처리 로직
      }
    }

    if (storedLoginStatus && storedUser) {
      setIsLoggedIn(storedLoginStatus);
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData)); // 유저 데이터 로컬 스토리지에 저장
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  // AuthContext 값에 user 값, login, logout 함수 포함
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
