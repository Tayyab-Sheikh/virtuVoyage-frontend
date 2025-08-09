import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import NotificationIcon from "./NotificationIcon";

export default function Navbar({ title, userType, onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
        return [];
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

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#6a1b9a" }}
        >
          {title}
        </Typography>

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
      </Toolbar>
    </AppBar>
  );
}
