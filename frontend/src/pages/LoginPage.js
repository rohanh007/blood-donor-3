import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, Tab, Tabs,
  Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress
} from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', role: 'receiver', phone: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await login(loginData);
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await register(regData);
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a0000 0%, #3d0000 40%, #1a0000 100%)', p: 2 }}>
      <Paper elevation={24} sx={{ width: '100%', maxWidth: 440, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #b71c1c, #c62828)', p: 3, textAlign: 'center' }}>
          <BloodtypeIcon sx={{ fontSize: 48, color: 'white', mb: 1 }} />
          <Typography variant="h5" sx={{ color: 'white', fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
            BloodBank Pro
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Saving Lives, One Drop at a Time
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} centered sx={{ mb: 2, '& .MuiTab-root': { fontWeight: 600 }, '& .Mui-selected': { color: '#c62828' }, '& .MuiTabs-indicator': { backgroundColor: '#c62828' } }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {tab === 0 ? (
            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Email" type="email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required fullWidth size="small" />
              <TextField label="Password" type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required fullWidth size="small" />
              <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#b71c1c' }, py: 1.2, fontWeight: 600 }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
              </Button>
              <Box sx={{ background: '#fff8f8', borderRadius: 1, p: 1.5, border: '1px solid #ffcdd2' }}>
                <Typography variant="caption" display="block" sx={{ color: '#555', fontWeight: 600, mb: 0.5 }}>Test Credentials:</Typography>
                <Typography variant="caption" display="block" sx={{ color: '#555' }}>Admin: admin@bloodbank.com</Typography>
                <Typography variant="caption" display="block" sx={{ color: '#555' }}>Donor: donor@bloodbank.com</Typography>
                <Typography variant="caption" display="block" sx={{ color: '#555' }}>Receiver: receiver@bloodbank.com</Typography>
                <Typography variant="caption" display="block" sx={{ color: '#555' }}>Password: Password@123</Typography>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Full Name" value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} required fullWidth size="small" />
              <TextField label="Email" type="email" value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} required fullWidth size="small" />
              <TextField label="Phone" value={regData.phone} onChange={e => setRegData({ ...regData, phone: e.target.value })} fullWidth size="small" />
              <TextField label="Password" type="password" value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} required fullWidth size="small" />
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select value={regData.role} onChange={e => setRegData({ ...regData, role: e.target.value })} label="Role">
                  <MenuItem value="donor">Donor</MenuItem>
                  <MenuItem value="receiver">Receiver</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#b71c1c' }, py: 1.2, fontWeight: 600 }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Register'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
