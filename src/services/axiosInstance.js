import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if it exists
const token = localStorage.getItem("token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;
