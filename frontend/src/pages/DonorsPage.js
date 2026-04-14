import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, TextField,
  Select, MenuItem, FormControl, InputLabel, Button, Avatar,
  IconButton, Tooltip, CircularProgress, Alert, Switch, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { getDonors, deleteDonor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const bgColor = { 'A+': '#e53935', 'A-': '#c62828', 'B+': '#1565c0', 'B-': '#0d47a1', 'AB+': '#6a1b9a', 'AB-': '#4a148c', 'O+': '#2e7d32', 'O-': '#1b5e20' };

const DonorCard = ({ donor, onDelete, canEdit }) => {
  const { userId: user, bloodGroup, location, availability, age, lastDonated, totalDonations } = donor;
  return (
    <Card elevation={2} sx={{ borderRadius: 2, height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }, border: availability ? '1px solid #c8e6c9' : '1px solid #eee' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: bgColor[bloodGroup] || '#c62828', width: 48, height: 48, fontWeight: 700, fontSize: 16 }}>
              {bloodGroup}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>{user?.name || 'Unknown'}</Typography>
              <Chip label={availability ? 'Available' : 'Unavailable'} size="small"
                sx={{ bgcolor: availability ? '#e8f5e9' : '#ffebee', color: availability ? '#2e7d32' : '#c62828', height: 20, fontSize: 10, fontWeight: 600 }} />
            </Box>
          </Box>
          {canEdit && (
            <Box>
              <Tooltip title="Delete"><IconButton size="small" onClick={() => onDelete(donor._id)} sx={{ color: '#c62828' }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon fontSize="small" sx={{ color: '#999' }} />
            <Typography variant="body2" color="text.secondary">{location}</Typography>
          </Box>
          {user?.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon fontSize="small" sx={{ color: '#999' }} />
              <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Box><Typography variant="caption" color="text.secondary">Age</Typography><Typography variant="body2" fontWeight={600}>{age}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">Donations</Typography><Typography variant="body2" fontWeight={600}>{totalDonations || 0}</Typography></Box>
            {lastDonated && <Box><Typography variant="caption" color="text.secondary">Last Donated</Typography><Typography variant="body2" fontWeight={600}>{new Date(lastDonated).toLocaleDateString()}</Typography></Box>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ bloodGroup: '', location: '', availability: '' });
  const { user, isAdmin, isDonor } = useAuth();
  const navigate = useNavigate();

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.bloodGroup) params.bloodGroup = search.bloodGroup;
      if (search.location) params.location = search.location;
      if (search.availability !== '') params.availability = search.availability;
      const { data } = await getDonors(params);
      setDonors(data.data);
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchDonors(); }, [fetchDonors]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donor profile?')) return;
    try {
      await deleteDonor(id);
      toast.success('Donor deleted');
      fetchDonors();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const canEditDonor = (donor) => isAdmin || (isDonor && donor.userId?._id === user._id);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif' }}>
          Blood Donors
        </Typography>
        {isDonor && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/donor-profile')}
            sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#b71c1c' } }}>
            My Profile
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card elevation={1} sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField label="Search by Location" size="small" fullWidth value={search.location}
              onChange={e => setSearch({ ...search, location: e.target.value })}
              InputProps={{ endAdornment: <SearchIcon sx={{ color: '#999' }} /> }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Blood Group</InputLabel>
              <Select value={search.bloodGroup} onChange={e => setSearch({ ...search, bloodGroup: e.target.value })} label="Blood Group">
                <MenuItem value="">All</MenuItem>
                {BLOOD_GROUPS.map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Availability</InputLabel>
              <Select value={search.availability} onChange={e => setSearch({ ...search, availability: e.target.value })} label="Availability">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Available</MenuItem>
                <MenuItem value="false">Unavailable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress sx={{ color: '#c62828' }} /></Box>
      ) : donors.length === 0 ? (
        <Alert severity="info">No donors found matching your criteria.</Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{donors.length} donor(s) found</Typography>
          <Grid container spacing={2}>
            {donors.map(donor => (
              <Grid item xs={12} sm={6} md={4} key={donor._id}>
                <DonorCard donor={donor} onDelete={handleDelete} canEdit={canEditDonor(donor)} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DonorsPage;
