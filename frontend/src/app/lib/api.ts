import axios from "axios";
// it acts as a instance of axios so we can use it anywhere
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
