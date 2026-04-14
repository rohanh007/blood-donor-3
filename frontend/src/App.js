import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DonorsPage from './pages/DonorsPage';
import DonorProfile from './pages/DonorProfile';
import RequestsPage from './pages/RequestsPage';
import UsersPage from './pages/UsersPage';

const theme = createTheme({
  palette: { primary: { main: '#c62828' }, secondary: { main: '#1565c0' } },
  typography: { fontFamily: '"DM Sans", "Helvetica", sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
  }
});

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/donors" element={<ProtectedRoute><DonorsPage /></ProtectedRoute>} />
          <Route path="/donor-profile" element={<ProtectedRoute roles={['donor']}><DonorProfile /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={['admin']}><UsersPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        </Routes>
      </Box>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
