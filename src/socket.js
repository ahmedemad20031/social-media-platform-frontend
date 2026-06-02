import { io } from "socket.io-client";

const socket = io(
  "https://social-media-platform-production-42b8.up.railway.app",
  {
    transports: ["websocket"],
    withCredentials: true,
  },
);

export default socket;
