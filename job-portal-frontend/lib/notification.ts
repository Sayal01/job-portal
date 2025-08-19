import axios from "axios";
import { API_URL } from "./config";
import Cookies from "js-cookie";

export const fetchNotifications = async () => {
  const token = Cookies.get("AuthToken"); // read fresh token
  const { data } = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const markNotificationAsRead = async (id: number) => {
  const token = Cookies.get("AuthToken");
  await axios.post(
    `${API_URL}/notifications/${id}/read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const clearReadNotifications = async () => {
  const token = Cookies.get("AuthToken");
  const { data } = await axios.delete(`${API_URL}/notifications/clear-read`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
