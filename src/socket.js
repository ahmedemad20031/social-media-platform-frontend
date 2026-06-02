import { io } from "socket.io-client";

const SOCKET_URL =
  "https://social-media-platform-production-42b8.up.railway.app";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  forceNew: true,
});

export default socket;
