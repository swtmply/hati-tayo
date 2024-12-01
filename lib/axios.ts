import axios from "axios";

const serverURL = process.env.EXPO_PUBLIC_SERVER_URL;

export default axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
