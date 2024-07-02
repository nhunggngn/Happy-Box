import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Tạo root mới

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();
