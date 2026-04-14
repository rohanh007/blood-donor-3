import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Drawer, List, ListItem, ListItemText, Chip, Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { useAuth } from '../context/AuthContext';

const roleColor = { admin: '#c62828', donor: '#1565c0', receiver: '#2e7d32' };

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const links = [
    { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'donor', 'receiver'] },
    { label: 'Donors', path: '/donors', roles: ['admin', 'donor', 'receiver'] },
    { label: 'Blood Requests', path: '/requests', roles: ['admin', 'donor', 'receiver'] },
    { label: 'Manage Users', path: '/users', roles: ['admin'] },
    { label: 'My Profile', path: '/donor-profile', roles: ['donor'] },
  ].filter(l => !user || l.roles.includes(user.role));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)', boxShadow: '0 2px 20px rgba(198,40,40,0.4)' }}>
        <Toolbar>
          <BloodtypeIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" component={Link} to="/dashboard" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: 1 }}>
            BloodBank Pro
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {links.map(l => (
              <Button key={l.path} component={Link} to={l.path} sx={{ color: 'white', fontWeight: location.pathname === l.path ? 700 : 400, borderBottom: location.pathname === l.path ? '2px solid white' : 'none', borderRadius: 0, px: 1.5 }}>
                {l.label}
              </Button>
            ))}
            {user && (
              <>
                <IconButton onClick={e => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                      <Chip label={user.role} size="small" sx={{ bgcolor: roleColor[user.role], color: 'white', height: 18, fontSize: 10, mt: 0.5 }} />
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: '#c62828' }}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {links.map(l => (
              <ListItem button key={l.path} component={Link} to={l.path} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={l.label} />
              </ListItem>
            ))}
            {user && <ListItem button onClick={handleLogout}><ListItemText primary="Logout" sx={{ color: '#c62828' }} /></ListItem>}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
