import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRequests, createRequest, updateRequestStatus, deleteRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const statusColor = { pending: '#f57c00', approved: '#1565c0', completed: '#2e7d32', rejected: '#c62828' };
const urgencyColor = { normal: '#2e7d32', urgent: '#f57c00', critical: '#c62828' };

const RequestCard = ({ request, onStatusChange, onDelete, isAdmin, isDonor }) => {
  const { bloodGroup, location, unitsRequired, urgency, status, requesterId, notes, createdAt } = request;
  return (
    <Card elevation={2} sx={{ borderRadius: 2, borderLeft: `4px solid ${urgencyColor[urgency]}`, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={bloodGroup} sx={{ bgcolor: '#ffebee', color: '#c62828', fontWeight: 700, fontSize: 13 }} />
            <Chip label={urgency} size="small" sx={{ bgcolor: urgencyColor[urgency] + '20', color: urgencyColor[urgency], textTransform: 'capitalize', fontWeight: 600 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip label={status} size="small" sx={{ bgcolor: statusColor[status] + '20', color: statusColor[status], textTransform: 'capitalize', fontWeight: 700 }} />
            <Tooltip title="Delete"><IconButton size="small" onClick={() => onDelete(request._id)} sx={{ color: '#bbb', '&:hover': { color: '#c62828' } }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        </Box>

        <Typography variant="body1" fontWeight={600}>{location}</Typography>
        <Typography variant="body2" color="text.secondary">{unitsRequired} unit(s) required</Typography>
        {notes && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>"{notes}"</Typography>}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Requested by: {requesterId?.name || 'Unknown'} • {new Date(createdAt).toLocaleDateString()}
        </Typography>

        {(isAdmin || isDonor) && status === 'pending' && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
            <Button size="small" variant="outlined" color="success" onClick={() => onStatusChange(request._id, 'approved')} sx={{ flex: 1 }}>Approve</Button>
            <Button size="small" variant="outlined" color="error" onClick={() => onStatusChange(request._id, 'rejected')} sx={{ flex: 1 }}>Reject</Button>
          </Box>
        )}
        {(isAdmin) && status === 'approved' && (
          <Button size="small" variant="outlined" color="success" fullWidth sx={{ mt: 1.5 }} onClick={() => onStatusChange(request._id, 'completed')}>
            Mark Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({ bloodGroup: '', location: '', unitsRequired: 1, urgency: 'normal', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin, isDonor, isReceiver } = useAuth();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const { data } = await getRequests(params);
      setRequests(data.data);
    } finally { setLoading(false); }
  }, [filterStatus]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRequest({ ...form, unitsRequired: Number(form.unitsRequired) });
      toast.success('Blood request created!');
      setDialogOpen(false);
      setForm({ bloodGroup: '', location: '', unitsRequired: 1, urgency: 'normal', notes: '' });
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    } finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await deleteRequest(id);
      toast.success('Request deleted');
      fetchRequests();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif' }}>
          Blood Requests
        </Typography>
        {isReceiver && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#b71c1c' } }}>
            New Request
          </Button>
        )}
      </Box>

      {/* Status Filter */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {['', 'pending', 'approved', 'completed', 'rejected'].map(s => (
          <Chip key={s || 'all'} label={s || 'All'} onClick={() => setFilterStatus(s)} clickable
            sx={{ textTransform: 'capitalize', fontWeight: filterStatus === s ? 700 : 400, bgcolor: filterStatus === s ? '#c62828' : 'transparent', color: filterStatus === s ? 'white' : 'inherit', border: '1px solid', borderColor: filterStatus === s ? '#c62828' : '#ddd' }} />
        ))}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress sx={{ color: '#c62828' }} /></Box>
      ) : requests.length === 0 ? (
        <Alert severity="info">{isReceiver ? "You haven't made any blood requests yet." : "No blood requests found."}</Alert>
      ) : (
        <Grid container spacing={2}>
          {requests.map(req => (
            <Grid item xs={12} sm={6} md={4} key={req._id}>
              <RequestCard request={req} onStatusChange={handleStatusChange} onDelete={handleDelete} isAdmin={isAdmin} isDonor={isDonor} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Request Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#c62828', color: 'white', fontFamily: '"Playfair Display", serif' }}>
          New Blood Request
        </DialogTitle>
        <Box component="form" onSubmit={handleCreate}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
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
                <TextField label="Units Required" type="number" value={form.unitsRequired} onChange={e => setForm({ ...form, unitsRequired: e.target.value })} required fullWidth inputProps={{ min: 1, max: 10 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Urgency</InputLabel>
                  <Select value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })} label="Urgency">
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Additional Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} fullWidth multiline rows={2} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#b71c1c' } }}>
              {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Request'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default RequestsPage;
