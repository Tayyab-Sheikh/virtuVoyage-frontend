import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import ExploreIcon from "@mui/icons-material/Explore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "../services/axiosInstance";
import { toast } from "react-toastify";

export default function Tours() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get("/tourist/tours");
      setTours(response.data || []);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
      toast.error("Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollNow = (tour) => {
    navigate("/checkout", { state: { tour } });
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0f7fa, #ede7f6)",
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: 64 }}
        >
          🛫🌍🧳
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #e0f7fa, #ede7f6)",
      }}
    >
      <Navbar title="Available Tours" userType="tourist" />

      <Container sx={{ textAlign: "center", py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Available Virtual Tours
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Join immersive experiences from anywhere in the world.
          </Typography>
        </motion.div>
      </Container>

      <Container sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {tours.length > 0 ? (
            tours.map((tour) => (
              <Grid item xs={12} sm={6} md={4} key={tour._id || tour.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: (tour._id || tour.id) * 0.1,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      ".overlay": {
                        opacity: 0,
                        transition: "all 0.3s",
                      },
                      ":hover": {
                        filter: "blur(1px)",
                        ".overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Card
                      elevation={3}
                      sx={{
                        borderRadius: 4,
                        height: "100%",
                        overflow: "hidden",
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
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {tour.name || tour.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tour.place || tour.location}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${tour.price}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button
                          size="small"
                          variant="contained"
                          fullWidth
                          sx={{
                            backgroundColor: "#6a1b9a",
                            textTransform: "none",
                            display: "flex",
                            gap: 1,
                          }}
                          onClick={() => handleEnrollNow(tour)}
                        >
                          Enroll Now <AirplanemodeActiveIcon fontSize="small" />
                        </Button>
                      </CardActions>
                    </Card>
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(255,255,255,0.6)",
                        borderRadius: 4,
                        backdropFilter: "blur(3px)",
                        pointerEvents: "none",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        Explore Tour <ExploreIcon sx={{ ml: 1 }} />
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
              >
                No tours available at the moment.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
