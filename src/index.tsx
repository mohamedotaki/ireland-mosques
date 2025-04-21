import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProviderWrapper } from './hooks/ThemeContext';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PopupProviderWrapper } from './hooks/PopupContext';
import "./services/i18n"
import { AuthProvider } from './hooks/AuthContext';
import { UpdateProvider } from './hooks/UpdateContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'react-quill/dist/quill.snow.css'; // Import styles for Quill

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <AuthProvider>
        <PopupProviderWrapper>
          <UpdateProvider>
            <App />
          </UpdateProvider>
        </PopupProviderWrapper>
      </AuthProvider>
    </ThemeProviderWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
/* serviceWorkerRegistration.register();
 */

reportWebVitals();
