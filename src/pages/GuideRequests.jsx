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
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../services/axiosInstance";
import PersonIcon from "@mui/icons-material/Person";

export default function GuideRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseModal, setResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/tour-requests/available");
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

  const handleOpenResponseModal = (request) => {
    setSelectedRequest(request);
    setResponse("");
    setResponseModal(true);
  };

  const handleAcceptRequest = async () => {
    try {
      await axios.put(`/tour-requests/${selectedRequest._id}/accept`, {
        guideResponse: response,
      });
      toast.success("Tour request accepted successfully!");
      setResponseModal(false);
      setSelectedRequest(null);
      setResponse("");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to accept tour request");
      console.error(err);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await axios.put(`/tour-requests/${selectedRequest._id}/decline`, {
        guideResponse: response,
      });
      toast.success("Tour request declined");
      setResponseModal(false);
      setSelectedRequest(null);
      setResponse("");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to decline tour request");
      console.error(err);
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
            Tour Requests
          </Typography>
          <Button href="/guide-dashboard" color="inherit">
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
          Available Tour Requests
        </Typography>

        {requests.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tour requests available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for new tour requests from tourists.
            </Typography>
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

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ mr: 1, bgcolor: "#6a1b9a" }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        Requested by: {request.tourist?.name || "Unknown"}
                      </Typography>
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
                          Your Response:
                        </Typography>
                        <Typography variant="body2">
                          {request.guideResponse}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  {request.status === "pending" && (
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenResponseModal(request)}
                        sx={{ backgroundColor: "#6a1b9a" }}
                      >
                        Respond
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Response Modal */}
      <Dialog
        open={responseModal}
        onClose={() => setResponseModal(false)}
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
        <DialogTitle>Respond to Tour Request</DialogTitle>
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
          {selectedRequest && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRequest.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedRequest.description}
              </Typography>

              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="body2">
                  <strong>Location:</strong> {selectedRequest.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Preferred Date:</strong>{" "}
                  {new Date(selectedRequest.preferredDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {selectedRequest.duration} hours
                </Typography>
                <Typography variant="body2">
                  <strong>Max Tourists:</strong> {selectedRequest.maxTourists}
                </Typography>
                <Typography variant="body2">
                  <strong>Budget:</strong> ${selectedRequest.budget}
                </Typography>
                {selectedRequest.specialRequirements && (
                  <Typography variant="body2">
                    <strong>Special Requirements:</strong>{" "}
                    {selectedRequest.specialRequirements}
                  </Typography>
                )}
              </Box>

              <TextField
                label="Your Response"
                multiline
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                fullWidth
                placeholder="Provide details about your tour offer, pricing, and any questions..."
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setResponseModal(false)}>Cancel</Button>
          <Button
            onClick={handleDeclineRequest}
            variant="outlined"
            color="error"
          >
            Decline
          </Button>
          <Button
            onClick={handleAcceptRequest}
            variant="contained"
            sx={{ backgroundColor: "#6a1b9a" }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
