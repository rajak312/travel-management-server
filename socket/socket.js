import { Server } from 'socket.io';

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

export const getSocket = () => ioInstance;
