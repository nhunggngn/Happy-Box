import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css'; // Nhập Bulma CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Nhập Bootstrap CSS
import './index.css'; // Nhập CSS tùy chỉnh của bạn
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
