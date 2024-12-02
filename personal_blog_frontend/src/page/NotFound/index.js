import React from 'react';
import './notfound.css';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在</p>
      <button onClick={() => navigate('/')}>返回首页</button>
    </div>
  );
};

export default NotFound;
