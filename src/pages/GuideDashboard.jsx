import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { MenuItem } from "@mui/material";
import axios from "../services/axiosInstance";
import Navbar from "../components/Navbar";

export default function GuideDashboard() {
  const [myTours, setMyTours] = useState([]);
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalTours: 0,
    pendingTours: 0,
    completedTours: 0,
    cancelledTours: 0,
    totalTourists: 0,
    totalRevenue: 0.0,
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);
  const [newTour, setNewTour] = useState({
    title: "",
    description: "",
    price: "",
    startDate: "",
    maxTourists: "",
    status: "pending", // Add status field with default value
    images: [], // Array of base64 strings
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, paymentsRes] = await Promise.all([
          axios.get("/tours/my-tours"),
          axios.get("/tours/payments"),
        ]);

        const tours = toursRes.data || [];
        const payments = paymentsRes.data || [];

        setMyTours(tours);
        setPayments(payments);

        // Calculate analytics
        const completedTours = tours.filter(
          (tour) => tour.status === "completed"
        );
        const pendingTours = tours.filter((tour) => tour.status === "pending");
        const cancelledTours = tours.filter(
          (tour) => tour.status === "cancelled"
        );

        const totalTourists = Array.isArray(payments)
          ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
          : 0;
        const totalRevenue = Array.isArray(payments)
          ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
          : 0;

        setAnalytics({
          totalTours: tours.length,
          pendingTours: pendingTours.length,
          completedTours: completedTours.length,
          cancelledTours: cancelledTours.length,
          totalTourists: totalTourists || 0,
          totalRevenue: totalRevenue || 0,
        });
      } catch (err) {
        toast.error("Failed to load guide data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingTourId(null);
    setNewTour({
      title: "",
      description: "",
      price: "",
      startDate: "",
      maxTourists: "",
      status: "pending",
      images: [],
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEdit = (tour) => {
    setIsEditing(true);
    setEditingTourId(tour._id || tour.id);

    // Format the date for datetime-local input
    let formattedStartDate = "";
    if (tour.startDate) {
      const date = new Date(tour.startDate);
      formattedStartDate = date.toISOString().slice(0, 16);
    }

    setNewTour({
      title: tour.title || "",
      description: tour.description || "",
      price: tour.price || "",
      startDate: formattedStartDate,
      maxTourists: tour.maxTourists || "",
      status: tour.status || "pending",
      images: tour.images || [],
    });
    setOpen(true);
  };

  const handleUpdateTourSubmit = async () => {
    try {
      const tourData = {
        ...newTour,
        endDate: newTour.startDate, // Set endDate to same as startDate
      };
      await axios.put(`/tours/${editingTourId}`, tourData);
      toast.success("Tour updated successfully!");
      setOpen(false);
      setIsEditing(false);
      setEditingTourId(null);
      setNewTour({
        title: "",
        description: "",
        price: "",
        startDate: "",
        maxTourists: "",
        status: "pending",
        images: [],
      });
      // Refresh the tour list
      const toursRes = await axios.get("/tours/my-tours");
      setMyTours(toursRes.data || []);
    } catch (err) {
      toast.error("Failed to update tour");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tours/${id}`);
      toast.success("Tour deleted");
      setMyTours((prev) => prev.filter((tour) => tour._id !== id));
    } catch (err) {
      toast.error("Failed to delete tour");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTour((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTourSubmit = async () => {
    try {
      const tourData = {
        ...newTour,
        endDate: newTour.startDate, // Set endDate to same as startDate
      };
      await axios.post("/tours", tourData);
      toast.success("Tour added!");
      setOpen(false);
      setIsEditing(false);
      setEditingTourId(null);
      setNewTour({
        title: "",
        description: "",
        price: "",
        startDate: "",
        maxTourists: "",
        status: "pending",
        images: [],
      });
      // Refresh the tour list
      const toursRes = await axios.get("/tours/my-tours");
      setMyTours(toursRes.data || []);
    } catch (err) {
      toast.error("Failed to add tour");
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((base64Images) => {
      setNewTour((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
    });
  };

  if (loading) {
    return (
      <Typography sx={{ mt: 6, textAlign: "center" }}>
        Loading guide dashboard...
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
      <Navbar title="Guide Dashboard" userType="guide" />

      <Container sx={{ py: 6 }}>
        {/* Analytics Summary */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Tour Stats
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {Object.entries(analytics).map(([key, value]) => (
            <Grid item xs={6} md={2} key={key}>
              <Paper
                elevation={3}
                sx={{ p: 2, textAlign: "center", borderRadius: 3 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {key.replace(/([A-Z])/g, " $1")}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* My Tours Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            My Tours
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6a1b9a" }}
            onClick={handleOpen}
          >
            + Add New Tour
          </Button>
        </Box>

        <Grid container spacing={4}>
          {myTours.map((tour) => (
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
                  image={tour.images[0]}
                  alt={tour.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{tour.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tour.place}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {tour.status || "pending"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start:{" "}
                    {tour.startDate
                      ? new Date(tour.startDate).toLocaleString()
                      : "Not set"}
                  </Typography>
                  <Typography variant="subtitle1">
                    Price: ${tour.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button size="small" onClick={() => handleEdit(tour)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(tour.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            maxHeight: "90vh", // prevents overflow while avoiding scrollbar
          },
        }}
      >
        <DialogTitle>{isEditing ? "Edit Tour" : "Add New Tour"}</DialogTitle>
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
          <TextField
            label="Tour Title"
            name="title"
            value={newTour.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={newTour.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Price ($)"
            name="price"
            type="number"
            value={newTour.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={newTour.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Max Tourists"
            name="maxTourists"
            type="number"
            value={newTour.maxTourists}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Tour Status"
            name="status"
            value={newTour.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>

          <Button variant="outlined" component="label">
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>

          {/* Image Previews */}
          {newTour.images.length > 0 && (
            <Grid container spacing={1}>
              {newTour.images.map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <Box
                    component="img"
                    src={img}
                    sx={{
                      width: "100%",
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={isEditing ? handleUpdateTourSubmit : handleAddTourSubmit}
            variant="contained"
            sx={{ backgroundColor: "#6a1b9a" }}
          >
            {isEditing ? "Update Tour" : "Add Tour"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
