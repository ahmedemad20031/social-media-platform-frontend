import axios from "axios";
import React, { useEffect } from "react";

function ReadNotification() {
  const token = localStorage.getItem("token");

  async function update() {
    try {
      const res = await axios.put(
        "https://social-media-platform-production-4442.up.railway.app/api/v1/notification/update",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    update();
  }, []);

  return <div></div>;
}

export default ReadNotification;
