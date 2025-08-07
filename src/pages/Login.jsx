import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  TextField,
  Link,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "../services/axiosInstance";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");

      setTimeout(() => {
        const roleRoutes = {
          tourist: "/dashboard",
          guide: "/guide-dashboard",
          admin: "/admin-dashboard",
        };
        window.location.href = roleRoutes[user.role] || "/";
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)", // semi-transparent white
          backdropFilter: "blur(10px)", // blur effect
          WebkitBackdropFilter: "blur(10px)", // for Safari
          boxShadow: "none",
          zIndex: 10,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "#6a1b9a" }}
          >
            VirtuVoyage
          </Typography>
          <Button href="/" sx={{ color: "#6a1b9a" }}>
            Home
          </Button>
          <Button href="/tours" sx={{ color: "#6a1b9a" }}>
            Tours
          </Button>
          <Button href="/register" sx={{ color: "#6a1b9a" }}>
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* Fullscreen login with background image and gradient */}
      <Box
        sx={{
          height: "calc(100vh - 64px)", // Adjust for AppBar height
          backgroundImage: `url('/bg-login.jpg')`,
          backgroundSize: "cover",
          pt: 8,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 5,
              backdropFilter: "blur(14px)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#6a1b9a" }}
            >
              Login to VirtuVoyage
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  backgroundColor: "#6a1b9a",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  px: 4,
                  py: 1.5,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#4a148c",
                    transform: "scale(1.02) translateX(4px)",
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Login"
                )}
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ color: "#6a1b9a" }}
                >
                  Register here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
