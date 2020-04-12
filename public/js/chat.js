$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io.connect('http://localhost:3000');
    //Socket nhận data và append vào giao diện
    socket.on("send", function (data) {
        $("#content").append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    })

    //Bắt sự kiện click gửi message
    $("#sendMessage").on('click', function () {
        var username = $('#username').val();
        var message = $('#message').val();
        // console.log(username)
        // if(username == ''){
        //     alert('Please enter name !!');
        // } else {
        //     socket.emit('send', {username: username});
        //     var itemUserActive = '<li>'+ username+'</li>'
        //     $("#list-user-active").append(itemUserActive)
        // }

        if (username == '' || message == '') {
            alert('Please enter name and message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('send', {username: username, message: message});
            $('#message').val('');
            console.log({username:username})
        }
    })
})