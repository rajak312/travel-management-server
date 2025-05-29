import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../config/logger.js';  // assuming you have Winston logger here

let ioInstance;

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`✅ Client connected: ${socket.id}`);

    const handleConnection = async () => {
      const token = socket.handshake.auth?.accessToken;

      if (!token) {
        logger.warn("❌ No access token provided, disconnecting socket: " + socket.id);
        return socket.disconnect();
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId).select('role');
        if (!user) {
          logger.warn(`❌ User not found in DB for socket ${socket.id}, disconnecting`);
          return socket.disconnect();
        }

        socket.join(userId.toString());

        if (user.role === 'admin') {
          socket.join('admins');
        }

        logger.info(`👤 User ${userId} joined rooms: ${userId}${user.role === 'admin' ? ', admins' : ''}`);
      } catch (err) {
        logger.error(`❌ Invalid or expired access token for socket ${socket.id}: ${err.message}`);
        return socket.disconnect();
      }
    };

    handleConnection();

    socket.on('message', (data) => {
      logger.info('📨 Message received:', data);
      io.emit('message', data);
    });

    socket.on('disconnect', () => {
      logger.info('❌ Client disconnected:', socket.id);
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
