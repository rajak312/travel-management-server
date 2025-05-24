import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let ioInstance;

export const initSocket = (server) => {
  console.log("client",process.env.CLIENT_URL)
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    const handleConnection = async () => {
      const token = socket.handshake.auth?.token;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.id;

          const user = await User.findById(userId);
          if (!user) {
            console.log('❌ User not found in DB');
            return socket.disconnect();
          }

          const role = user.role;

          socket.join(userId.toString());
          if (role === 'admin') {
            socket.join('admins');
          }

          console.log(`👤 DB User ${userId} joined rooms: ${userId}${role === 'admin' ? ', admins' : ''}`);
        } catch (err) {
          console.error("❌ Error verifying token or fetching user:", err.message);
          socket.disconnect();
        }
      } else {
        console.log("❌ No auth token provided");
        socket.disconnect();
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
