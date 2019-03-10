const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');
const io = socketio();

const socketApi = {
	io
};

/**
 * LIBS
*/

const Users = require('../src/lib/Users');
const Rooms = require('../src/lib/Rooms');
const Messages = require('../src/lib/Messages');


/**
 * Socket Middleware
*/

//Soket yetkilendirme middleware ı
io.use(socketAuthorization);

/**
 * REDIS ADAPTER
 */

const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ 
    host: process.env.REDIS_URI, 
    port: process.env.REDIS_PORT
}));

//Socket dinleme ve karşılama
io.on('connection', socket => {
    console.log('a user logged in with name ' + socket.request.user.name);
    Users.upsert(socket.id, socket.request.user);

    Rooms.list(rooms => {
        io.emit('roomList', rooms);
    })

    //Online kullanıcı listesinin alınması
    Users.list(users => {
        io.emit('onlineList', users);
    });

    //Yeni oda kurulu için gerekli soket işlemleri

    socket.on('newRoom', (roomName)=> {
        Rooms.upsert(roomName);
        Rooms.list(rooms => {
            io.emit('roomList', rooms);
        })
    });

    socket.on('newMessage', data => {
        const messageData = {
            ...data,
            userId:socket.request.user._id,
            username:socket.request.user.name,
            surname:socket.request.user.surname,
        };
        Messages.upsert(messageData);
        socket.broadcast.emit('receiveMessage', messageData);
    });
    
    socket.on('disconnect', ()=> {
        //Kullanıcının offline olduğu için online listesinden çıkarılması
        Users.remove(socket.request.user._id);
        //Online kullanıcı listesinin tekrar çekilmesi
        Users.list(users => {
            io.emit('onlineList', users);
        })
    })
});

module.exports = socketApi;