import React from 'react';
import ReactDOM from 'react-dom'; // Chú ý: Đường dẫn đã thay đổi
import 'bulma/css/bulma.min.css'; // Nhập Bulma CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Nhập Bootstrap CSS
import './index.css'; // Nhập CSS tùy chỉnh của bạn
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Tạo root
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Render thành phần App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Đăng ký service worker
registerServiceWorker();
