import axios from "axios";

export const MuseumAPI = axios.create({
  baseURL: process.env.REACT_APP_VISUAL_MUSEUM_API,
});
