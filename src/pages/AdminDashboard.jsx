import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../services/axiosInstance"; // or wherever your axios is set up
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({});
  const [guides, setGuides] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, dashboardRes, paymentsRes] = await Promise.all([
          axios.get("/admin/users"),
          axios.get("/admin/dashboard"),
          axios.get("/admin/payments"),
        ]);

        const allUsers = usersRes.data || [];
        const guideAccounts = allUsers.filter((u) => u.role === "guide");

        setGuides(guideAccounts || []);
        setAnalytics(dashboardRes.data || {});
        setPayments(paymentsRes.data || []);
      } catch (err) {
        toast.error("Failed to load admin data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleGuideStatus = async (id, newStatus) => {
    try {
      await axios.put(`/admin/approve/${id}`, { isApproved: newStatus });
      setGuides((prev) =>
        prev.map((g) => (g._id === id ? { ...g, isApproved: newStatus } : g))
      );
      toast.success(`Guide ${newStatus ? "approved" : "deactivated"}`);
    } catch (err) {
      toast.error("Failed to update guide status");
    }
  };

  const totalRevenue = Array.isArray(payments)
    ? payments.reduce((sum, p) => sum + (p.amount || 0), 0)
    : 0;

  const commissionRate = 0.1;
  const totalCommission = totalRevenue * commissionRate;

  if (loading)
    return (
      <Typography sx={{ mt: 6, textAlign: "center" }}>
        Loading admin dashboard...
      </Typography>
    );

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
            Admin Dashboard
          </Typography>
          <Button href="/admin-requests" color="inherit">
            Tour Requests
          </Button>
          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 6 }}>
        {/* Platform Analytics */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Platform Overview
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: "Total Tourists", value: analytics?.tourists ?? 0 },
            { label: "Total Guides", value: analytics?.guides ?? 0 },
            { label: "Total Tours", value: analytics?.tours ?? 0 },
            { label: "Completed Tours", value: analytics?.completedTours ?? 0 },
            { label: "Pending Tours", value: analytics?.pendingTours ?? 0 },
            { label: "Cancelled Tours", value: analytics?.cancelledTours ?? 0 },
            {
              label: "Total Revenue",
              value: `$${analytics?.totalRevenue ?? 0}`,
            },
            {
              label: "Platform Commission",
              value: `$${totalCommission.toFixed(2)}`,
            },
          ].map((item, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper
                elevation={3}
                sx={{ p: 2, textAlign: "center", borderRadius: 3 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {item.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Guide Approval Table */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Guide Approvals
        </Typography>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guides?.map((guide) => (
                <TableRow key={guide._id || guide.id}>
                  <TableCell>{guide.name || "N/A"}</TableCell>
                  <TableCell>{guide.email || "N/A"}</TableCell>
                  <TableCell>
                    {guide.isApproved ? "approved" : "pending"}
                  </TableCell>
                  <TableCell>
                    {guide.isApproved === false && (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ backgroundColor: "#6a1b9a", mr: 1 }}
                        onClick={() => toggleGuideStatus(guide._id, true)}
                      >
                        Approve
                      </Button>
                    )}
                    {guide.isApproved && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => toggleGuideStatus(guide._id, false)}
                      >
                        Deactivate
                      </Button>
                    )}
                    {/* {guide.status === "deactivated" && (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ backgroundColor: "#6a1b9a" }}
                        onClick={() => toggleGuideStatus(guide.id, "approved")}
                      >
                        Reactivate
                      </Button>
                    )} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
