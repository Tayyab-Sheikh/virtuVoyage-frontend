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
  Link,
} from "@mui/material";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/bg-tour.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          bgcolor: "rgba(255, 255, 255, 0.85)",
        }}
      />

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
          <Button href="/login" sx={{ color: "#6a1b9a" }}>
            Log In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          textAlign: "center",
          pt: 14,
          pb: 10,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Explore Virtual Tours
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          maxWidth="sm"
          mx="auto"
        >
          Discover and participate in virtual tours from the comfort of your
          home.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            backgroundColor: "#6a1b9a",
            borderRadius: 10,
            px: 4,
            "&:hover": {
              backgroundColor: "#8e24aa",
            },
          }}
          href="/tours"
        >
          Browse Tours
        </Button>
      </Container>

      {/* Role Cards */}
      <Container sx={{ py: 8, position: "relative", zIndex: 2 }}>
        <Grid container spacing={4}>
          {[
            {
              title: "For Tour Guides",
              desc: "Manage your virtual tours and connect with travelers.",
              link: "/register?role=guide",
            },
            {
              title: "For Tourists",
              desc: "Discover and enroll in virtual tours worldwide.",
              link: "/register?role=tourist",
            },
          ].map((item, index) => (
            <Grid
              item
              xs={12}
              md={6}
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
            >
              <Card
                elevation={4}
                sx={{
                  borderRadius: 4,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#6a1b9a",
                      fontWeight: "bold",
                    }}
                    gutterBottom
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.desc}
                  </Typography>
                  <Link href={item.link} underline="hover" color="primary">
                    Sign up
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
