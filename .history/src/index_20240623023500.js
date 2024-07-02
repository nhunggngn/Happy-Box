import React from 'react';
import { createRoot } from 'react-dom/client';
import "bulma/css/bulma.min.css";
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Tìm element root trong DOM
const container = document.getElementById('root');

// Tạo root và render App
const root = createRoot(container);
root.render(<App />);

// Đăng ký service worker
registerServiceWorker();
