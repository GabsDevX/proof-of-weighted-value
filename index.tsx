import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = document.getElementById('root');

if (!(root instanceof HTMLDivElement)) {
  throw new Error('Application bootstrap failed: expected a <div id="root"> container.');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
