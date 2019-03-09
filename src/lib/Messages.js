const redisClient = require('../redisClient');
const shortid = require('shortid');
//Redis bağlantısı
function Messages() {
    //Redis istemcisi oluşturma
    this.client = redisClient.getClient();
}

module.exports = new Messages();
//Oda oluşturma
Messages.prototype.upsert = function ({roomId, message, username, surname}) {
    this.client.hset(
        'messages:'+ roomId,
		shortid.generate(),
        JSON.stringify({
            username,
            surname,
            message,
            when:Date.now()
        })
    ),
    err => {
        if(err) {
            console.error(err)
        }
    }
};


// //Online kullanıcıların listelenmesi
// Rooms.prototype.list = function (callback) {
// 	let roomList = [];

// 	this.client.hgetall('rooms', function (err, rooms) {
// 		if (err) {
// 		  console.error(err);
// 		  return callback([]);
// 		}

// 		for (let room in rooms){
// 			roomList.push(JSON.parse(rooms[room]));
// 		}

// 		return callback(roomList);
// 	})
// };