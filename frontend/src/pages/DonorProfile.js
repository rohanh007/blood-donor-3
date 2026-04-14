import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Switch, FormControlLabel, Alert, CircularProgress, Grid, Chip
} from '@mui/material';
import { createDonor, updateDonor, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorProfile = () => {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: '', location: '', age: '', weight: '',
    availability: true, medicalHistory: 'None', lastDonated: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMe();
        if (data.donorProfile) {
          setDonorProfile(data.donorProfile);
          setForm({
            bloodGroup: data.donorProfile.bloodGroup || '',
            location: data.donorProfile.location || '',
            age: data.donorProfile.age || '',
            weight: data.donorProfile.weight || '',
            availability: data.donorProfile.availability ?? true,
            medicalHistory: data.donorProfile.medicalHistory || 'None',
            lastDonated: data.donorProfile.lastDonated ? data.donorProfile.lastDonated.substring(0, 10) : ''
          });
        }
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, age: Number(form.age), weight: Number(form.weight) };
      if (!payload.lastDonated) delete payload.lastDonated;
      if (donorProfile) {
        const { data } = await updateDonor(donorProfile._id, payload);
        setDonorProfile(data.data);
        toast.success('Profile updated successfully!');
      } else {
        const { data } = await createDonor(payload);
        setDonorProfile(data.data);
        toast.success('Donor profile created!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress sx={{ color: '#c62828' }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif' }}>
          {donorProfile ? 'My Donor Profile' : 'Register as Donor'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {donorProfile ? 'Update your information and availability status' : 'Fill in your details to become a blood donor'}
        </Typography>
      </Box>

      {donorProfile && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Chip label={`Blood Group: ${donorProfile.bloodGroup}`} sx={{ bgcolor: '#ffebee', color: '#c62828', fontWeight: 700 }} />
          <Chip label={donorProfile.availability ? '✓ Available to Donate' : '✗ Not Available'} sx={{ bgcolor: donorProfile.availability ? '#e8f5e9' : '#ffebee', color: donorProfile.availability ? '#2e7d32' : '#c62828' }} />
          <Chip label={`${donorProfile.totalDonations || 0} Donations`} sx={{ bgcolor: '#e3f2fd', color: '#1565c0' }} />
        </Box>
      )}

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Blood Group</InputLabel>
                <Select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} label="Blood Group">
                  {BLOOD_GROUPS.map(bg => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location / City" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required fullWidth inputProps={{ min: 18, max: 65 }} helperText="18–65 years" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Weight (kg)" type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required fullWidth inputProps={{ min: 50 }} helperText="Minimum 50 kg" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Donated Date" type="date" value={form.lastDonated} onChange={e => setForm({ ...form, lastDonated: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Medical History" value={form.medicalHistory} onChange={e => setForm({ ...form, medicalHistory: e.target.value })} fullWidth placeholder="None / Any conditions" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={form.availability} onChange={e => setForm({ ...form, availability: e.target.checked })} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#2e7d32' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiTabs-track': { bgcolor: '#2e7d32' } }} />}
                label={<Typography fontWeight={600}>{form.availability ? '✓ Available to Donate' : '✗ Currently Unavailable'}</Typography>}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth disabled={saving} sx={{ py: 1.4, fontWeight: 700, bgcolor: '#c62828', '&:hover': { bgcolor: '#b71c1c' } }}>
                {saving ? <CircularProgress size={22} color="inherit" /> : (donorProfile ? 'Update Profile' : 'Create Donor Profile')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default DonorProfile;
