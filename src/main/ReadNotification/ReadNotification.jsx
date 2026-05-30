import axios from "axios";
import React, { useEffect } from "react";

const BASE_URL = "https://social-media-platform-production-42b8.up.railway.app";

function ReadNotification() {
  const token = localStorage.getItem("token");

  async function updateNotificationStatus() {
    if (!token) return;

    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/notifications/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(
        "Notifications update response:",
        res.data?.message || "Success",
      );
    } catch (error) {
      console.error(
        "Error updating notifications read status:",
        error.response?.data?.message || error.message,
      );
    }
  }

  useEffect(() => {
    updateNotificationStatus();
  }, []);

  return null;
}

export default ReadNotification;
