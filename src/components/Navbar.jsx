import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import NotificationIcon from "./NotificationIcon";

export default function Navbar({ title, userType, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isAuthenticated = !!userType;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getNavButtons = () => {
    switch (userType) {
      case "tourist":
        return [
          { label: "Browse Tours", href: "/tours" },
          { label: "My Requests", href: "/my-requests" },
        ];
      case "guide":
        return [
          { label: "Browse Tours", href: "/tours" },
          { label: "Tour Requests", href: "/guide-requests" },
        ];
      case "admin":
        return [{ label: "Tour Requests", href: "/admin-requests" }];
      default:
        return [];
    }
  };

  const getDashboardHref = () => {
    switch (userType) {
      case "tourist":
        return "/dashboard";
      case "guide":
        return "/guide-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/dashboard";
    }
  };

  const getPublicNavButtons = () => {
    return [
      { label: "Home", href: "/" },
      { label: "Tours", href: "/tours" },
    ];
  };

  const getPublicAuthButtons = () => {
    return [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ];
  };

  const navItems = isAuthenticated
    ? [{ label: "Dashboard", href: getDashboardHref() }, ...getNavButtons()]
    : [...getPublicNavButtons()];

  const authItems = isAuthenticated ? [] : getPublicAuthButtons();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          my: 2,
          fontWeight: "bold",
          color: "#6a1b9a",
          borderBottom: "2px solid #6a1b9a",
          pb: 1,
        }}
      >
        {title}
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              href={item.href}
              sx={{
                textAlign: "center",
                "&:hover": {
                  backgroundColor: "rgba(106, 27, 154, 0.1)",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  color: "#6a1b9a",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Show auth buttons for unauthenticated users */}
        {!isAuthenticated &&
          authItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                href={item.href}
                sx={{
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: "rgba(106, 27, 154, 0.1)",
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: "#6a1b9a",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

        {/* Only show notification icon for authenticated tourist and guide in mobile */}
        {isAuthenticated &&
          (userType === "tourist" || userType === "guide") && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: "rgba(106, 27, 154, 0.1)",
                  },
                }}
              >
                <ListItemText
                  primary="Notifications"
                  sx={{
                    color: "#6a1b9a",
                    fontWeight: 500,
                  }}
                />
                <NotificationIcon userType={userType} />
              </ListItemButton>
            </ListItem>
          )}

        {/* Only show logout for authenticated users */}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                textAlign: "center",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                },
              }}
            >
              <ListItemText
                primary="Logout"
                sx={{
                  color: "#f44336",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "#6a1b9a",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {title}
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Show navigation items based on authentication status */}
              {isAuthenticated ? (
                <>
                  <Button href={getDashboardHref()} color="inherit">
                    Dashboard
                  </Button>

                  {getNavButtons().map((button, index) => (
                    <Button key={index} href={button.href} color="inherit">
                      {button.label}
                    </Button>
                  ))}

                  {/* Only show notification icon for tourist and guide */}
                  {(userType === "tourist" || userType === "guide") && (
                    <NotificationIcon userType={userType} />
                  )}

                  <Button onClick={handleLogout} color="inherit">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {/* Public navigation for unauthenticated users */}
                  {getPublicNavButtons().map((button, index) => (
                    <Button key={index} href={button.href} color="inherit">
                      {button.label}
                    </Button>
                  ))}

                  {/* Auth buttons for unauthenticated users */}
                  {getPublicAuthButtons().map((button, index) => (
                    <Button key={index} href={button.href} color="inherit">
                      {button.label}
                    </Button>
                  ))}
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                color: "#6a1b9a",
                "&:hover": {
                  backgroundColor: "rgba(106, 27, 154, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            backgroundColor: "#fff",
            borderRight: "2px solid #e0e0e0",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
