import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.11:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
