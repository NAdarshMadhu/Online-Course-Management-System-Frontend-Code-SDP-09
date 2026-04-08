import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';
import { StudentsProvider } from './context/StudentsContext';
import { AssignmentsProvider } from './context/AssignmentsContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CoursesProvider>
            <StudentsProvider>
              <AssignmentsProvider>
                <App />
              </AssignmentsProvider>
            </StudentsProvider>
          </CoursesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
