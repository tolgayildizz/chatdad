app.factory('userFactory', ['$http', 'env', ($http,env) => {
    //Mesajları listeyecek fonksiyonu yazdık
    const getUser = () => {
        return $http({
            url:env.SERVICE_URL + 'getUser',
            method:'GET'
        }).then(res => {
            return res.data;
        }, (err)=> {
            console.log('service fail:', err);
        });
    }

    return {
        getUser
    };
}]);