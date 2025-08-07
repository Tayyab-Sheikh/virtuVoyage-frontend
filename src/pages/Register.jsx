import {
  AppBar,
  Toolbar,
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Link,
  MenuItem,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import axios from "../services/axiosInstance";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tourist",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [animatePlane, setAnimatePlane] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnimatePlane(true); // Trigger animation

    setTimeout(() => {
      setAnimatePlane(false); // Reset animation after it's done
      // Your registration logic here...
    }, 800); // Match duration of animation
    const { name, email, password, role } = formData;

    if (!name || !email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success("Registration successful! Please login.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url('/bg-register.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.6)", // light semi-transparent background
          backdropFilter: "blur(10px)",
          color: "#6a1b9a", // brand purple text
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            VirtuVoyage
          </Typography>
          <Button href="/" sx={{ color: "#6a1b9a" }}>
            HOME
          </Button>
          <Button href="/tours" sx={{ color: "#6a1b9a" }}>
            TOURS
          </Button>
          <Button href="/login" sx={{ color: "#6a1b9a" }}>
            LOGIN
          </Button>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xs">
          <ToastContainer />
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ color: "#6a1b9a", fontWeight: "bold" }}
            >
              Register for VirtuVoyage
            </Typography>

            <Box
              component="form"
              noValidate
              sx={{ mt: 2 }}
              onSubmit={handleSubmit}
            >
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                select
                label="Role"
                name="role"
                fullWidth
                margin="normal"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="tourist">Tourist</MenuItem>
                <MenuItem value="guide">Tour Guide</MenuItem>
              </TextField>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  backgroundColor: "#6a1b9a",
                  borderRadius: "30px",
                  height: 50,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {loading ? "Registering..." : "Register"}
                <FlightTakeoffIcon
                  sx={{
                    ml: 1,
                    transition: "transform 0.8s ease-in-out",
                    transform: animatePlane
                      ? "translateX(100px)"
                      : "translateX(0)",
                  }}
                />
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link href="/login" underline="hover">
                  Log in here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
