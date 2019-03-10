app.factory('chatFactory', ['$http', 'env', ($http,env) => {
    //Mesajları listeyecek fonksiyonu yazdık
    const getMessages = roomId => {
        return $http({
            url:env.SERVICE_URL + 'messages/list',
            method:'GET',
            params: {
                roomId
            }
        }).then(res => {
            return res.data;
        }, (err)=> {
            console.log('service fail:', err);
        });
    }

    return {
        getMessages
    };
}]);