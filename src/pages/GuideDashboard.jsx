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

const analytics = {
  totalTours: 8,
  pendingTours: 2,
  completedTours: 5,
  cancelledTours: 1,
  totalTourists: 120,
  totalRevenue: "$2,500",
};

const myTours = [
  {
    id: 1,
    name: "Taj Mahal Virtual Experience",
    place: "Agra, India",
    image:
      "data:image/jpeg;base64,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",
    status: "Completed",
    price: "$12.00",
  },
  {
    id: 2,
    name: "Pyramids of Giza Tour",
    place: "Cairo, Egypt",
    image:
      "data:image/jpeg;base64,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",
    status: "Pending",
    price: "$20.00",
  },
];

export default function GuideDashboard() {
  const [myTours, setMyTours] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTour, setNewTour] = useState({
    title: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
    maxTourists: "",
    images: [], // Array of base64 strings
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, paymentsRes] = await Promise.all([
          axios.get("/tours/my-tours"),
          axios.get("/tours/payments"),
        ]);

        setMyTours(toursRes.data || []);
        setPayments(paymentsRes.data || []);
      } catch (err) {
        toast.error("Failed to load guide data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const completedTours = myTours.filter((tour) => tour.status === "Completed");
  const pendingTours = myTours.filter((tour) => tour.status === "Pending");
  const cancelledTours = myTours.filter((tour) => tour.status === "Cancelled");

  const totalTourists = Array.isArray(payments)
    ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
    : 0;
  const totalRevenue = Array.isArray(payments)
    ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
    : 0;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEdit = (id) => {
    alert(`Edit tour ${id}`);
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
      await axios.post("/tours", newTour);
      toast.success("Tour added!");
      setOpen(false);
      setNewTour({
        title: "",
        description: "",
        price: "",
        startDate: "",
        endDate: "",
        maxTourists: "",
        images: [],
      });
      // optionally refresh tour list
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
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "#6a1b9a" }}
          >
            Guide Dashboard
          </Typography>
          <Button href="/tours" color="inherit">
            Browse Tours
          </Button>
          <Button href="/guide-requests" color="inherit">
            Tour Requests
          </Button>
          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

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
                  alt={tour.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{tour.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tour.place}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {tour.status}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {tour.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button size="small" onClick={() => handleEdit(tour.id)}>
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
        <DialogTitle>Add New Tour</DialogTitle>
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
            type="date"
            value={newTour.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={newTour.endDate}
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
            onClick={handleAddTourSubmit}
            variant="contained"
            sx={{ backgroundColor: "#6a1b9a" }}
          >
            Add Tour
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
