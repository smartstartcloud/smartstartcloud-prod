import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { TokenContextProvider } from './context/TokenContext';
import { getApp } from './utils/constants';

const root = ReactDOM.createRoot(document.getElementById('root'));
const CurrentApp = getApp();

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <TokenContextProvider>
        <BrowserRouter>
          <CurrentApp />
        </BrowserRouter>
      </TokenContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);