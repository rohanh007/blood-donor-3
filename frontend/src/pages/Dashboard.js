import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, CircularProgress,
  List, ListItem, ListItemText, ListItemSecondaryAction, Avatar, Paper
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useAuth } from '../context/AuthContext';
import { getUsers, getDonors, getRequests } from '../services/api';

const statusColor = { pending: '#f57c00', approved: '#1565c0', completed: '#2e7d32', rejected: '#c62828' };
const urgencyColor = { normal: '#2e7d32', urgent: '#f57c00', critical: '#c62828' };

const StatCard = ({ icon, label, value, color }) => (
  <Card elevation={3} sx={{ borderRadius: 2, borderLeft: `4px solid ${color}`, height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: `${color}20`, color }}>{icon}</Avatar>
      <Box>
        <Typography variant="h4" fontWeight={700} color={color}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, isAdmin, isDonor, isReceiver } = useAuth();
  const [data, setData] = useState({ users: [], donors: [], requests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, donorsRes, requestsRes] = await Promise.allSettled([
          isAdmin ? getUsers() : Promise.resolve({ data: { data: [] } }),
          getDonors(),
          getRequests(),
        ]);
        setData({
          users: usersRes.value?.data?.data || [],
          donors: donorsRes.value?.data?.data || [],
          requests: requestsRes.value?.data?.data || [],
        });
      } finally { setLoading(false); }
    };
    fetchData();
  }, [isAdmin]);

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress sx={{ color: '#c62828' }} /></Box>;

  const pendingRequests = data.requests.filter(r => r.status === 'pending');
  const availableDonors = data.donors.filter(d => d.availability);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif', color: '#1a1a1a' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Chip label={user?.role?.toUpperCase()} size="small" sx={{ bgcolor: '#c62828', color: 'white', fontWeight: 700, fontSize: 11 }} />
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isAdmin && (
          <Grid item xs={6} sm={3}>
            <StatCard icon={<PeopleIcon />} label="Total Users" value={data.users.length} color="#1565c0" />
          </Grid>
        )}
        <Grid item xs={6} sm={isAdmin ? 3 : 4}>
          <StatCard icon={<VolunteerActivismIcon />} label="Total Donors" value={data.donors.length} color="#c62828" />
        </Grid>
        <Grid item xs={6} sm={isAdmin ? 3 : 4}>
          <StatCard icon={<BloodtypeIcon />} label="Available Donors" value={availableDonors.length} color="#2e7d32" />
        </Grid>
        <Grid item xs={6} sm={isAdmin ? 3 : 4}>
          <StatCard icon={<PendingActionsIcon />} label="Pending Requests" value={pendingRequests.length} color="#f57c00" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Requests */}
        <Grid item xs={12} md={isAdmin ? 7 : 12}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#c62828', color: 'white' }}>
              <Typography variant="h6" fontWeight={600}>
                {isReceiver ? 'My Blood Requests' : 'Recent Blood Requests'}
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {data.requests.slice(0, 6).length === 0 ? (
                <ListItem><ListItemText primary="No requests found" secondary="Create your first blood request" /></ListItem>
              ) : data.requests.slice(0, 6).map(req => (
                <ListItem key={req._id} divider sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                  <Avatar sx={{ bgcolor: '#ffebee', color: '#c62828', mr: 2, fontWeight: 700, fontSize: 13 }}>
                    {req.bloodGroup}
                  </Avatar>
                  <ListItemText
                    primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{req.bloodGroup} — {req.location}</Typography>
                      <Chip label={req.urgency} size="small" sx={{ bgcolor: urgencyColor[req.urgency] + '20', color: urgencyColor[req.urgency], height: 18, fontSize: 10 }} />
                    </Box>}
                    secondary={`${req.unitsRequired} units • ${req.requesterId?.name || 'Unknown'}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip label={req.status} size="small" sx={{ bgcolor: statusColor[req.status] + '20', color: statusColor[req.status], fontWeight: 600, textTransform: 'capitalize' }} />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Available Donors / Admin: Blood Group Breakdown */}
        <Grid item xs={12} md={isAdmin ? 5 : 12}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#1565c0', color: 'white' }}>
              <Typography variant="h6" fontWeight={600}>Available Donors by Blood Group</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => {
                const count = availableDonors.filter(d => d.bloodGroup === bg).length;
                return (
                  <Box key={bg} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                    <Chip label={bg} size="small" sx={{ minWidth: 50, bgcolor: '#ffebee', color: '#c62828', fontWeight: 700 }} />
                    <Box sx={{ flex: 1, height: 8, bgcolor: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${Math.min((count / Math.max(availableDonors.length, 1)) * 100, 100)}%`, bgcolor: '#c62828', borderRadius: 4, transition: 'width 0.5s ease' }} />
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 20 }}>{count}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Donor Profile Card (for donors) */}
        {isDonor && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ borderRadius: 2, p: 3, border: '1px solid #ffcdd2' }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#c62828', mb: 1 }}>Your Donor Status</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your donor profile, update availability, and track your donation history from the "My Profile" section.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
