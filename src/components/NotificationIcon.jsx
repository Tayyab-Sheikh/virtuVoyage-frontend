import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "../services/axiosInstance";

export default function NotificationIcon({ userType = "tourist" }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(false);

  const POLLING_INTERVAL = 15000; // 15 seconds

  const getNotificationEndpoint = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id || user.id;

      if (!userId) {
        console.warn("User ID not found in localStorage");
        return null; // Return null to indicate no endpoint available
      }

      switch (userType) {
        case "guide":
          return `notifications/guide/${userId}`;
        case "tourist":
          return `notifications/tourist/${userId}`;
        default:
          console.warn(
            `Unknown userType: ${userType}, using fallback endpoint`
          );
          return "/notifications";
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  };

  const fetchNotifications = async () => {
    const endpoint = getNotificationEndpoint();

    if (!endpoint) {
      console.log("No notification endpoint available for userType:", userType);
      setNotifications([]);
      setUnreadCount(0);
      setError(false);
      return;
    }

    try {
      const response = await axios.get(endpoint);
      const data = response.data || [];
      // Handle different data structures
      const notificationsArray = Array.isArray(data)
        ? data
        : data.notifications || data.data || [];
      setNotifications(notificationsArray);
      const unread = notificationsArray.filter(
        (notification) => !notification.read
      ).length;
      setUnreadCount(unread);
      setError(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Don't show error to user if notifications API doesn't exist
      setNotifications([]);
      setUnreadCount(0);
      setError(true);
    }
  };

  useEffect(() => {
    // Fetch notifications immediately
    fetchNotifications();

    // Set up polling every 15 seconds
    const interval = setInterval(fetchNotifications, POLLING_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [userType]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`/notifications/${notificationId}`);
      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ||
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Even if the API call fails, update the local state for better UX
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ||
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      }
    } catch (error) {
      return "Recently";
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleNotificationClick}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: 350,
          },
        }}
      >
        {error ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              Unable to load notifications
            </Typography>
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id || notification.id}
              onClick={() =>
                handleMarkAsRead(notification._id || notification.id)
              }
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                py: 1,
                px: 2,
                backgroundColor: notification.read ? "transparent" : "#f5f5f5",
                "&:hover": {
                  backgroundColor: notification.read ? "#f5f5f5" : "#e0e0e0",
                },
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={notification.read ? "normal" : "bold"}
                >
                  {notification.title || notification.message || "Notification"}
                </Typography>
                {notification.message &&
                  notification.title &&
                  notification.message !== notification.title && (
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                  )}
                <Typography variant="caption" color="text.secondary">
                  {formatDate(
                    notification.createdAt || notification.created_at
                  )}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
