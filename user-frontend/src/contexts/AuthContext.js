import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化時從 localStorage 讀取認證資訊
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // 驗證 token 是否有效
          try {
            // 可選：發送請求到 /api/users/me 驗證 token
            // const response = await api.get('/api/users/me');
            // 如果 API 可用，可以使用 response.data 更新用戶資訊
            
            setToken(storedToken);
            setUser(parsedUser);
          } catch (err) {
            // token 無效，清除存儲的認證資訊
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('初始化認證狀態失敗:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 登入函式
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // 嘗試一般用戶登入
      let response;
      try {
        response = await api.post('/api/users/login', { email, password });
      } catch (err) {
        // 如果一般登入失敗，嘗試管理員登入
        if (err.response && err.response.status === 401) {
          response = await api.post('/api/users/adminLogin', { email, password });
        } else {
          throw err;
        }
      }
      
      const { token, user } = response.data;
      
      // 儲存認證資訊
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 更新 context 狀態
      setToken(token);
      setUser(user);
      
      return { user, token };
    } catch (err) {
      const errorMessage = err.response?.data?.message || '登入失敗，請檢查您的帳號密碼';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 登出函式
  const logout = () => {
    // 清除 localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 清除 context 狀態
    setToken(null);
    setUser(null);
  };

  // 計算衍生狀態
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isTutor = user?.role === 'tutor';

  // 提供給子組件的值
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isTutor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定義 hook 用於使用 AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 