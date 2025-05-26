import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let ioInstance;

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    const handleConnection = async () => {
      const token = socket.handshake.auth?.accessToken;

      if (!token) {
        console.log("❌ No access token provided");
        return socket.disconnect();
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId).select('role');
        if (!user) {
          console.log('❌ User not found in DB');
          return socket.disconnect();
        }

        // Join user-specific room
        socket.join(userId.toString());

        if (user.role === 'admin') {
          socket.join('admins');
        }

        console.log(`👤 User ${userId} joined rooms: ${userId}${user.role === 'admin' ? ', admins' : ''}`);
      } catch (err) {
        console.error("❌ Invalid or expired access token:", err.message);
        return socket.disconnect();
      }
    };

    handleConnection();

    socket.on('message', (data) => {
      console.log('📨 Message received:', data);
      io.emit('message', data);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  ioInstance = io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
};
