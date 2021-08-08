import { io } from "socket.io-client";
const url = 'ws://192.168.1.92:3000';





export const socket = io(url);

