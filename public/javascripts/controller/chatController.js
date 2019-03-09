app.controller('chatController', ['$scope', ($scope) => {
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

    //Oda değiştirme fonksiyonu
    $scope.switchRoom = (room) => {
        $scope.chatName = room.name;
        $scope.roomId = room.id;
        $scope.chatClicked = true;
    }

    //Yeni mesaj fonksiyonu 
    $scope.message = "";
    $scope.newMessage = () => {
        socket.emit('newMessage', {
            message:$scope.message,
            roomId:$scope.roomId,
        });
        $scope.message =  '';
        $scope.$apply();
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

}]);