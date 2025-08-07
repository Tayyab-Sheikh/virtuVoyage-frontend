import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../services/axiosInstance";

const enrolledTours = [
  {
    id: 1,
    name: "Machu Picchu Discovery",
    place: "Peru",
    image: "https://images.unsplash.com/photo-1503437313881-503a91226402",
    date: "2025-05-12",
  },
];

const reviews = [
  {
    id: 1,
    tour: "Ancient Rome Walkthrough",
    comment: "Amazing experience! Felt like I was really there.",
    rating: 5,
  },
];

const payments = [
  {
    id: 1,
    tour: "Safari from Afar",
    amount: "$15.00",
    date: "2025-04-01",
    status: "Paid",
  },
  {
    id: 2,
    tour: "Great Wall Explorer",
    amount: "$24.99",
    date: "2025-04-12",
    status: "Pending",
  },
];

export default function Dashboard() {
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [tourRequest, setTourRequest] = useState({
    title: "",
    description: "",
    preferredDate: "",
    duration: "",
    maxTourists: "",
    budget: "",
    location: "",
    specialRequirements: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleOpenRequestModal = () => setOpenRequestModal(true);
  const handleCloseRequestModal = () => setOpenRequestModal(false);

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setTourRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async () => {
    try {
      await axios.post("/tour-requests", tourRequest);
      toast.success("Tour request submitted successfully!");
      setOpenRequestModal(false);
      setTourRequest({
        title: "",
        description: "",
        preferredDate: "",
        duration: "",
        maxTourists: "",
        budget: "",
        location: "",
        specialRequirements: "",
      });
    } catch (err) {
      toast.error("Failed to submit tour request");
      console.error(err);
    }
  };

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
            Tourist Dashboard
          </Typography>
          <Button href="/tours" color="inherit">
            Browse Tours
          </Button>
          <Button href="/my-requests" color="inherit">
            My Requests
          </Button>
          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 6 }}>
        {/* Request Tour Button */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleOpenRequestModal}
            sx={{
              backgroundColor: "#6a1b9a",
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "#8e24aa",
              },
            }}
          >
            Request Custom Tour
          </Button>
        </Box>

        {/* Enrolled Tours */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Enrolled Tours
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {enrolledTours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={tour.image}
                  alt={tour.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {tour.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tour.place}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tour Date: {tour.date}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: "#6a1b9a", mt: "auto" }}
                  >
                    Join Tour
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Tour Reviews */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Reviews
        </Typography>
        {reviews.length ? (
          reviews.map((r) => (
            <Paper key={r.id} sx={{ p: 2, my: 2 }}>
              <Typography fontWeight="bold">{r.tour}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {r.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ⭐ {r.rating}/5
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body2">
            You haven't reviewed any tours yet.
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Payment History */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Payment History
        </Typography>
        {payments.length ? (
          payments.map((p) => (
            <Paper key={p.id} sx={{ p: 2, my: 2 }}>
              <Typography fontWeight="bold">{p.tour}</Typography>
              <Typography variant="body2">Amount: {p.amount}</Typography>
              <Typography variant="body2">Date: {p.date}</Typography>
              <Typography variant="body2">Status: {p.status}</Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body2">No payment records found.</Typography>
        )}
      </Container>

      {/* Tour Request Modal */}
      <Dialog
        open={openRequestModal}
        onClose={handleCloseRequestModal}
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
        <DialogTitle>Request Custom Tour</DialogTitle>
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
                value={tourRequest.title}
                onChange={handleRequestChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={tourRequest.description}
                onChange={handleRequestChange}
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
                value={tourRequest.preferredDate}
                onChange={handleRequestChange}
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
                value={tourRequest.duration}
                onChange={handleRequestChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Tourists"
                name="maxTourists"
                type="number"
                value={tourRequest.maxTourists}
                onChange={handleRequestChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Budget ($)"
                name="budget"
                type="number"
                value={tourRequest.budget}
                onChange={handleRequestChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={tourRequest.location}
                onChange={handleRequestChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Requirements (Optional)"
                name="specialRequirements"
                value={tourRequest.specialRequirements}
                onChange={handleRequestChange}
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseRequestModal}>Cancel</Button>
          <Button
            onClick={handleSubmitRequest}
            variant="contained"
            sx={{ backgroundColor: "#6a1b9a" }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
