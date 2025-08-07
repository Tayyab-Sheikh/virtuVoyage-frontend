import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../services/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    preferredDate: "",
    duration: "",
    maxTourists: "",
    budget: "",
    location: "",
    specialRequirements: "",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/tour-requests/my-requests");
      setRequests(response.data || []);
    } catch (err) {
      toast.error("Failed to load tour requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setEditForm({
      title: request.title,
      description: request.description,
      preferredDate: request.preferredDate?.split("T")[0] || "",
      duration: request.duration,
      maxTourists: request.maxTourists,
      budget: request.budget,
      location: request.location,
      specialRequirements: request.specialRequirements || "",
    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateRequest = async () => {
    try {
      await axios.put(`/tour-requests/${editingRequest._id}`, editForm);
      toast.success("Tour request updated successfully!");
      setEditModal(false);
      setEditingRequest(null);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update tour request");
      console.error(err);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this tour request?")) {
      try {
        await axios.delete(`/tour-requests/${requestId}`);
        toast.success("Tour request deleted successfully!");
        fetchRequests();
      } catch (err) {
        toast.error("Failed to delete tour request");
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "success";
      case "declined":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Typography sx={{ mt: 6, textAlign: "center" }}>
        Loading tour requests...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #e0f7fa, #ede7f6)",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "#6a1b9a" }}
          >
            My Tour Requests
          </Typography>
          <Button href="/dashboard" color="inherit">
            Dashboard
          </Button>
          <Button href="/tours" color="inherit">
            Browse Tours
          </Button>
          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Tour Requests
        </Typography>

        {requests.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tour requests found
            </Typography>
            <Button
              href="/dashboard"
              variant="contained"
              sx={{ backgroundColor: "#6a1b9a" }}
            >
              Request a Tour
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {requests.map((request) => (
              <Grid item xs={12} md={6} lg={4} key={request._id}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {request.title}
                      </Typography>
                      <Chip
                        label={request.status}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {request.description}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Location:</strong> {request.location}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Preferred Date:</strong>{" "}
                        {new Date(request.preferredDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {request.duration} hours
                      </Typography>
                      <Typography variant="body2">
                        <strong>Max Tourists:</strong> {request.maxTourists}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Budget:</strong> ${request.budget}
                      </Typography>
                      {request.specialRequirements && (
                        <Typography variant="body2">
                          <strong>Special Requirements:</strong>{" "}
                          {request.specialRequirements}
                        </Typography>
                      )}
                    </Box>

                    {request.guideResponse && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          Guide Response:
                        </Typography>
                        <Typography variant="body2">
                          {request.guideResponse}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(request)}
                      sx={{ color: "#6a1b9a" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(request._id)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Edit Modal */}
      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle>Edit Tour Request</DialogTitle>
        <DialogContent
          dividers
          sx={{
            maxHeight: "calc(90vh - 100px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tour Title"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                multiline
                rows={3}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Preferred Date"
                name="preferredDate"
                type="date"
                value={editForm.preferredDate}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Duration (hours)"
                name="duration"
                type="number"
                value={editForm.duration}
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Tourists"
                name="maxTourists"
                type="number"
                value={editForm.maxTourists}
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Budget ($)"
                name="budget"
                type="number"
                value={editForm.budget}
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Requirements (Optional)"
                name="specialRequirements"
                value={editForm.specialRequirements}
                onChange={handleEditChange}
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditModal(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateRequest}
            variant="contained"
            sx={{ backgroundColor: "#6a1b9a" }}
          >
            Update Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
