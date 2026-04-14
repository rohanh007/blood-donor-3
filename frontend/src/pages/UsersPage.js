import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Chip, IconButton, Tooltip, CircularProgress, Alert, Avatar, TableContainer
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUsers, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const roleColor = { admin: '#c62828', donor: '#1565c0', receiver: '#2e7d32' };

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("You can't delete yourself");
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
        Manage Users
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress sx={{ color: '#c62828' }} /></Box>
      ) : users.length === 0 ? (
        <Alert severity="info">No users found.</Alert>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#c62828' }}>
                  {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ color: 'white', fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, bgcolor: u._id === currentUser._id ? '#fff8f8' : 'white' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: roleColor[u.role] + '30', color: roleColor[u.role] }}>
                          {u.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                          {u._id === currentUser._id && <Typography variant="caption" color="text.secondary">(You)</Typography>}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2">{u.email}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{u.phone || '—'}</Typography></TableCell>
                    <TableCell>
                      <Chip label={u.role} size="small" sx={{ bgcolor: roleColor[u.role] + '20', color: roleColor[u.role], fontWeight: 700, textTransform: 'capitalize' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={u.isActive ? 'Active' : 'Inactive'} size="small" sx={{ bgcolor: u.isActive ? '#e8f5e9' : '#ffebee', color: u.isActive ? '#2e7d32' : '#c62828' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{new Date(u.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={u._id === currentUser._id ? "Can't delete yourself" : "Delete user"}>
                        <span>
                          <IconButton size="small" onClick={() => handleDelete(u._id)} disabled={u._id === currentUser._id} sx={{ color: u._id === currentUser._id ? '#ddd' : '#c62828' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default UsersPage;
