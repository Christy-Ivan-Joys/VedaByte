import { Server } from 'socket.io'
import { verifyUser, saveMessageToDatabase } from './utils/Helpers/socketHelpers'
import { formatDateTimeToIST, getTime } from './utils/Helpers/date'



export const socketConfig = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })
    const onlineUsers:any = {}
    io.on('connection', (socket) => {
        socket.on('authenticate', async (token) => {
            try {
                const user = await verifyUser(token)
                if (user.role === 'Student') {
                    socket.student = user
                } else {
                    socket.instructor = user
                }
                socket.emit('Authorized', user.user)       
                onlineUsers[user._id] = 'online'
                io.emit('userOnline', { userId: user.user._id, status: 'online' });

                socket.on('disconnect', () => {
                    io.emit('userOffline', { userId: user._id, status: 'offline' });
                    console.log('User disconnected')
                })

            } catch (error: any) {
                console.log(error)
                console.log(error.message)
                socket.emit('Unauthorized', (error.message))
            }
        })
       

        socket.on('joinRoom', (room) => {
            socket.join(room)
        })

        socket.on('privateMessage', async ({ type, sender, recipient, text, room }) => {
            const Time = getTime(Date.now())
            const ioString = new Date().toISOString()
            const formattedDate = formatDateTimeToIST(ioString)
            const messageData = { senderId: sender._id, recipientId: recipient._id, message: text, Time: formattedDate, type: type }
            const update = await saveMessageToDatabase(sender, recipient, text, ioString, type)
            io.to(room).emit('privateMessage', messageData)
        })
        socket.on('typing', (data) => {
            socket.to(data.room).emit('typing', data)
        })
        socket.on('stopTyping', (data) => {
            socket.to(data.room).emit('stopTyping', data);
        })
       

    })
}
