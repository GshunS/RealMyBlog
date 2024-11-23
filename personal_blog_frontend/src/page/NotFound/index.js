import React from 'react';
import './notfound.css';
import { useNavigate } from 'react-router-dom';
import { fectchLoginToken } from '../../store/modules/blogContentLoginStore';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../utils/apiService';

const NotFound = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const response = await fetchData(`${process.env.REACT_APP_API_URL}/authors/refreshToken?refToken=${localStorage.getItem('refreshToken_key')}`, 'POST', null,
        (data) => {
          localStorage.setItem('token_key', data.accessToken);
          localStorage.setItem('refreshToken_key', data.refreshToken);
        },
        (error) => {
          console.error('刷新Token失败:', error);
          return { success: false, error };
        }
      );

      if (response) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('刷新Token失败:', error);
      return { success: false, error };
    }
  };

  const testTokenRefresh = async () => {
    try {
      const result = await refreshToken();
      if (result.success) {
        alert('Token刷新成功！');
      } else {
        alert('Token刷新失败，请重新登录');
        navigate('/login');
      }
    } catch (error) {
      console.error('Token刷新错误:', error);
      alert('发生错误，请重新登录');
      navigate('/login');
    }
  };

  const testLogin = async () => {
    try {
      const loginData = {
        username: 'shun',  // 替换为测试用户名
        password: 'admin123'   // 替换为测试密码
      };
      const result = await dispatch(fectchLoginToken(loginData.username, loginData.password));
      if (result) {
        alert('登录成功！');
      } else {
        alert('登录失败！');
      }
    } catch (error) {
      console.error('登录错误:', error);
      alert('登录发生错误');
    }
  };

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在</p>
      <button onClick={() => navigate('/')}>返回首页</button>
      <button onClick={testTokenRefresh} className="test-token-btn">
        测试Token刷新
      </button>
      <button onClick={testLogin} className="test-login-btn">
        测试登录
      </button>
    </div>
  );
};

export default NotFound;
