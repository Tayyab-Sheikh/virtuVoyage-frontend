import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../services/axiosInstance";
import Navbar from "../components/Navbar";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tour, setTour] = useState(null);
  const [formData, setFormData] = useState({
    touristName: "",
    touristEmail: "",
    cardNumber: "",
    cardType: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  useEffect(() => {
    // Get tour details from location state or URL params
    if (location.state?.tour) {
      setTour(location.state.tour);
    } else {
      // Fallback tour data if accessed directly
      setTour({
        id: 1,
        name: "Ancient Rome Walkthrough",
        place: "Rome, Italy",
        price: "$19.99",
        image: "https://images.unsplash.com/photo-1503437313881-503a91226402",
      });
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-detect card type
    if (name === "cardNumber") {
      const cardNumber = value.replace(/\s/g, "");
      if (cardNumber.startsWith("4")) {
        setFormData((prev) => ({ ...prev, cardType: "visa" }));
      } else if (cardNumber.startsWith("5")) {
        setFormData((prev) => ({ ...prev, cardType: "mastercard" }));
      } else {
        setFormData((prev) => ({ ...prev, cardType: "" }));
      }
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "touristName",
      "touristEmail",
      "cardNumber",
      "expiryDate",
      "cvv",
      "cardholderName",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.touristEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate card number (basic validation)
    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      toast.error("Please enter a valid card number");
      return false;
    }

    // Validate CVV
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      toast.error("Please enter a valid CVV");
      return false;
    }

    // Validate expiry date
    const [month, year] = formData.expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      toast.error("Card has expired");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare enrollment data
      const enrollmentData = {
        tourId: tour.id,
        tourName: tour.name,
        tourPlace: tour.place,
        tourPrice: tour.price,
        touristName: formData.touristName,
        touristEmail: formData.touristEmail,
        paymentMethod: formData.cardType,
        paymentStatus: "completed",
        enrollmentDate: new Date().toISOString(),
      };

      // Send to backend using the correct endpoint
      await axios.post(`/tourist/enroll/${tour.id}`, enrollmentData);

      toast.success(
        "Tour enrollment successful! You will receive a confirmation email shortly."
      );

      // Redirect to dashboard or confirmation page
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to complete enrollment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (!tour) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f7fa, #ede7f6)",
      }}
    >
      <Navbar title="Checkout" userType="tourist" />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Complete Your Enrollment
        </Typography>

        <Grid container spacing={4}>
          {/* Tour Summary */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: 3, height: "fit-content" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Tour Summary
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <img
                    src={tour.image}
                    alt={tour.name}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {tour.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tour.place}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {tour.price}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Checkout Form */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <PaymentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Payment Information
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Test Card Numbers:</strong>
                    <br />
                    Visa: 4111 1111 1111 1111
                    <br />
                    Mastercard: 5555 5555 5555 4444
                    <br />
                    Any future expiry date and 3-digit CVV
                  </Typography>
                </Alert>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Tourist Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Tourist Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="touristName"
                        value={formData.touristName}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="touristEmail"
                        type="email"
                        value={formData.touristEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>

                    {/* Payment Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ mt: 2 }}
                      >
                        <CreditCardIcon
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        Payment Details
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            cardNumber: formatted,
                          }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            expiryDate: formatted,
                          }));
                        }}
                        placeholder="MM/YY"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setFormData((prev) => ({ ...prev, cvv: value }));
                        }}
                        placeholder="123"
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Card Type:
                        </Typography>
                        {formData.cardType && (
                          <Chip
                            label={formData.cardType.toUpperCase()}
                            color="primary"
                            size="small"
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/tours")}
                      sx={{ flex: 1 }}
                    >
                      Back to Tours
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        flex: 1,
                        backgroundColor: "#6a1b9a",
                        "&:hover": { backgroundColor: "#8e24aa" },
                      }}
                    >
                      {loading ? "Processing..." : `Enroll Now - ${tour.price}`}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
