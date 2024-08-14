"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketConfig = void 0;
const socket_io_1 = require("socket.io");
const socketHelpers_1 = require("./utils/Helpers/socketHelpers");
const date_1 = require("./utils/Helpers/date");
const socketConfig = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    const onlineUsers = {};
    io.on('connection', (socket) => {
        socket.on('authenticate', async (token) => {
            try {
                const user = await (0, socketHelpers_1.verifyUser)(token);
                if (user.role === 'Student') {
                    socket.student = user;
                }
                else {
                    socket.instructor = user;
                }
                socket.emit('Authorized', user.user);
                onlineUsers[user._id] = 'online';
                io.emit('userOnline', { userId: user.user._id, status: 'online' });
                socket.on('disconnect', () => {
                    io.emit('userOffline', { userId: user._id, status: 'offline' });
                    console.log('User disconnected');
                });
            }
            catch (error) {
                console.log(error);
                console.log(error.message);
                socket.emit('Unauthorized', (error.message));
            }
        });
        socket.on('joinRoom', (room) => {
            socket.join(room);
        });
        socket.on('privateMessage', async ({ type, sender, recipient, text, room }) => {
            const Time = (0, date_1.getTime)(Date.now());
            const ioString = new Date().toISOString();
            const formattedDate = (0, date_1.formatDateTimeToIST)(ioString);
            const messageData = { senderId: sender._id, recipientId: recipient._id, message: text, Time: formattedDate, type: type };
            const update = await (0, socketHelpers_1.saveMessageToDatabase)(sender, recipient, text, ioString, type);
            io.to(room).emit('privateMessage', messageData);
        });
        socket.on('typing', (data) => {
            socket.to(data.room).emit('typing', data);
        });
        socket.on('stopTyping', (data) => {
            socket.to(data.room).emit('stopTyping', data);
        });
    });
};
exports.socketConfig = socketConfig;
