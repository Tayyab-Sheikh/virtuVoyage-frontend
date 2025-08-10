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
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../services/axiosInstance";
import Navbar from "../components/Navbar";

// const enrolledTours = [
//   {
//     id: 1,
//     name: "Machu Picchu Discovery",
//     place: "Peru",
//     image: "https://images.unsplash.com/photo-1503437313881-503a91226402",
//     date: "2025-05-12",
//   },
// ];

// const reviews = [
//   {
//     id: 1,
//     tour: "Ancient Rome Walkthrough",
//     comment: "Amazing experience! Felt like I was really there.",
//     rating: 5,
//   },
// ];

// const payments = [
//   {
//     id: 1,
//     tour: "Safari from Afar",
//     amount: "$15.00",
//     date: "2025-04-01",
//     status: "Paid",
//   },
//   {
//     id: 2,
//     tour: "Great Wall Explorer",
//     amount: "$24.99",
//     date: "2025-04-12",
//     status: "Pending",
//   },
// ];

export default function Dashboard() {
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
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
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });
  const [enrolledTours, setEnrolledTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [enrolledRes, reviewsRes, paymentsRes] = await Promise.all([
        axios.get("/tourist/my-tours"),
        axios.get("/reviews"),
        axios.get("/tourist/my-payments"),
      ]);

      setEnrolledTours(enrolledRes.data || []);
      setReviews(reviewsRes.data || []);
      console.log(paymentsRes.data);
      setPayments(paymentsRes.data.payments || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleOpenRequestModal = () => setOpenRequestModal(true);
  const handleCloseRequestModal = () => setOpenRequestModal(false);

  const handleOpenReviewModal = (tour) => {
    // Check if user has already reviewed this tour
    const existingReview = Array.isArray(reviews)
      ? reviews.find((review) => review.tourId === (tour._id || tour.id))
      : null;

    if (existingReview) {
      toast.info("You have already reviewed this tour");
      return;
    }

    setSelectedTour(tour);
    setReviewData({ rating: 5, comment: "" });
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setSelectedTour(null);
    setReviewData({ rating: 5, comment: "" });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async () => {
    if (!reviewData.comment.trim()) {
      toast.error("Please provide a review comment");
      return;
    }

    if (!reviewData.rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const reviewPayload = {
        tourId: selectedTour._id || selectedTour.id,
        tourName: selectedTour.name || selectedTour.title,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim(),
      };

      await axios.post(
        `/reviews/${selectedTour._id || selectedTour.id}`,
        reviewPayload
      );
      toast.success("Review submitted successfully!");
      handleCloseReviewModal();

      // Refresh the reviews data
      const reviewsRes = await axios.get("/reviews");
      setReviews(reviewsRes.data || []);
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    }
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setTourRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async () => {
    try {
      await axios.post("/custom-tour-requests", tourRequest);
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
      <Navbar title="Tourist Dashboard" userType="tourist" />

      <Container sx={{ py: 6 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6">Loading dashboard...</Typography>
          </Box>
        ) : (
          <>
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
              {Array.isArray(enrolledTours) && enrolledTours.length > 0 ? (
                enrolledTours.map((tour) => (
                  <Grid item xs={12} sm={6} md={4} key={tour._id || tour.id}>
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
                        image={
                          tour.image ||
                          tour.images?.[0] ||
                          "https://via.placeholder.com/300x180"
                        }
                        alt={tour.name || tour.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {tour.name || tour.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tour.place || tour.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tour Date:{" "}
                          {tour.startDate
                            ? new Date(tour.startDate).toLocaleDateString()
                            : "TBD"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {tour.status || "Enrolled"}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        {tour.status === "completed" ? (
                          (() => {
                            const existingReview = Array.isArray(reviews)
                              ? reviews.find(
                                  (review) =>
                                    review.tourId === (tour._id || tour.id)
                                )
                              : null;

                            if (existingReview) {
                              return (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                  sx={{
                                    mt: "auto",
                                    color: "#666",
                                    borderColor: "#666",
                                  }}
                                >
                                  Already Reviewed
                                </Button>
                              );
                            }

                            return (
                              <Button
                                size="small"
                                variant="contained"
                                fullWidth
                                onClick={() => handleOpenReviewModal(tour)}
                                sx={{
                                  backgroundColor: "#4caf50",
                                  mt: "auto",
                                  "&:hover": {
                                    backgroundColor: "#45a049",
                                  },
                                }}
                              >
                                Review Tour
                              </Button>
                            );
                          })()
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            fullWidth
                            onClick={() => {
                              if (tour.zoomJoinLink) {
                                window.open(tour.zoomJoinLink, "_blank");
                              } else {
                                toast.info(
                                  "Zoom link not available for this tour"
                                );
                              }
                            }}
                            sx={{ backgroundColor: "#6a1b9a", mt: "auto" }}
                          >
                            Join Tour
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body2" textAlign="center">
                    You haven't enrolled in any tours yet.
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Tour Reviews */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              My Reviews
            </Typography>
            {Array.isArray(reviews.reviews) && reviews.reviews.length > 0 ? (
              reviews.reviews.map((r) => (
                <Paper key={r._id || r.id} sx={{ p: 2, my: 2 }}>
                  <Typography fontWeight="bold">{r.tour.title}</Typography>
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
            {Array.isArray(payments) && payments.length > 0 ? (
              payments.map((p) => (
                <Paper key={p._id || p.id} sx={{ p: 2, my: 2 }}>
                  <Typography fontWeight="bold">
                    {p.tour.title || p.tourName}
                  </Typography>
                  <Typography variant="body2">
                    Amount: ${p.amountPaid}
                  </Typography>
                  <Typography variant="body2">
                    Date:{" "}
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "N/A"}
                  </Typography>
                  <Typography variant="body2">Status: {p.status}</Typography>
                </Paper>
              ))
            ) : (
              <Typography variant="body2">No payment records found.</Typography>
            )}
          </>
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

      {/* Review Modal */}
      <Dialog
        open={openReviewModal}
        onClose={handleCloseReviewModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle>
          Review Tour: {selectedTour?.name || selectedTour?.title}
        </DialogTitle>
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
            select
            label="Rating"
            name="rating"
            value={reviewData.rating}
            onChange={handleReviewChange}
            fullWidth
            required
          >
            <MenuItem value={1}>1 Star</MenuItem>
            <MenuItem value={2}>2 Stars</MenuItem>
            <MenuItem value={3}>3 Stars</MenuItem>
            <MenuItem value={4}>4 Stars</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
          </TextField>
          <TextField
            label="Review Comment"
            name="comment"
            value={reviewData.comment}
            onChange={handleReviewChange}
            multiline
            rows={4}
            fullWidth
            required
            placeholder="Share your experience with this tour..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewModal}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            sx={{ backgroundColor: "#4caf50" }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
