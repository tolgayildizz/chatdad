app.controller('chatController', ['$scope', 'chatFactory', 'userFactory', ($scope,chatFactory,userFactory) => {
    
    /**
     * initilization
    */
    function init() {
        userFactory.getUser().then(user => {
            $scope.user = user;
        });
    };

    init();
    
    //Aktif tabın hangisi olduğunu default olarak belirttik
    $scope.activeTab = 1;
    //Tab değiştirme fonksiyonunu yazdık
    $scope.changeTab = tab => {
        $scope.activeTab =tab;
    };
    //Çevrimiçi kullanıcıların tutulacağı array
    $scope.onlineList = [];

    //Odaların tutulacağı array
    $scope.roomList = [];

    //Sohbet Seçimi
    $scope.chatClicked = false;

    //Sohbet başlığı değiştirme
    $scope.chatName = "";

    //Oda id'si ni tutmak
    $scope.roomId = "";

    //Mesajların tutulacağı array 
    $scope.messages = [];

    //User objesi
    $scope.user = {};

    //Loading değişkeni
    $scope.loadingMessages = false; 

    //Oda değiştirme fonksiyonu
    $scope.switchRoom = (room) => {
        $scope.chatName = room.name;
        $scope.roomId = room.id;
        $scope.chatClicked = true;
        if(!$scope.messages.hasOwnProperty(room.id)) {
            $scope.loadingMessages = true;
            console.log('Service connection');
            chatFactory.getMessages(room.id).then(data => {
                $scope.messages[room.id] = data;
                $scope.loadingMessages = false;
            });
        }

    }

    //Yeni mesaj fonksiyonu 
    $scope.message = "";
    $scope.newMessage = () => {
        if($scope.message.trim() != '') {
            socket.emit('newMessage', {
                message:$scope.message,
                roomId:$scope.roomId,
            });
            $scope.messages[$scope.roomId].push({
                userId:$scope.user._id,
                username:$scope.user.name,
                surname:$scope.user.surname,
                message:$scope.message,
            });
            $scope.message =  '';
        }     
    }

    //Yeni oda fonksiyonunun yazılması
    $scope.newRoom = () => {
        //let randomName = Math.random().toString(36).substring(7);
        let roomName = window.prompt('Enter room name');
        if(roomName !== '' && roomName !== null) {
            socket.emit('newRoom', roomName);
        }
    }
    
    const socket = io.connect("http://localhost:3000");
    
    //Online kullanıcı listesini soketten karşıladık
    socket.on('onlineList', users => {
        $scope.onlineList = users;
        $scope.$apply();
    });

    //Odaların gösterilmesi

    socket.on('roomList', rooms => {
        $scope.roomList = rooms;
        $scope.$apply();
    });

    socket.on('receiveMessage', message => {
        $scope.messages[message.roomId].push({
            userId:message.userId,
            username:message.username,
            surname:message.surname,
            message:message.message,
        });
        $scope.$apply();
    })

}]);