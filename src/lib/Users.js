const redisClient = require('../redisClient');

//Redis bağlantısı
function Users() {
    //Redis istemcisi oluşturma
    this.client = redisClient.getClient();
}

module.exports = new Users();
//Online listesine giriş
Users.prototype.upsert = function (connectionId, meta) {
    this.client.hset(
        'online',
        meta._id,
        JSON.stringify({
            connectionId,
            meta,
            when:Date.now()
        })
    ),
    err => {
        if(err) {
            console.error(err)
        }
    }
};
//Online Listesinden çıkış
Users.prototype.remove = function(_id) {
    this.client.hdel(
        'online',
        _id,
        err => {
            if(err) {
                console.error(err);
            }
        }
    )
};

//Online kullanıcıların listelenmesi
Users.prototype.list = function (callback) {
	let active = [];

	this.client.hgetall('online', function (err, users) {
		if (err) {
		  console.error(err);
		  return callback([]);
		}

		for (let user in users){
			active.push(JSON.parse(users[user]));
		}

		return callback(active);
	})
};