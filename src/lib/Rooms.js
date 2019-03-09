const redisClient = require('../redisClient');
const shortid = require('shortid');
//Redis bağlantısı
function Rooms() {
    //Redis istemcisi oluşturma
    this.client = redisClient.getClient();
}

module.exports = new Rooms();
//Oda oluşturma
Rooms.prototype.upsert = function (name) {
    const newId = shortid.generate();
    this.client.hset(
        'rooms',
        '@Room:'+ newId,
        JSON.stringify({
            id:'@Room:'+ newId,
            name,
            when:Date.now()
        })
    ),
    err => {
        if(err) {
            console.error(err)
        }
    }
};


//Online kullanıcıların listelenmesi
Rooms.prototype.list = function (callback) {
	let roomList = [];

	this.client.hgetall('rooms', function (err, rooms) {
		if (err) {
		  console.error(err);
		  return callback([]);
		}

		for (let room in rooms){
			roomList.push(JSON.parse(rooms[room]));
		}

		return callback(roomList);
	})
};