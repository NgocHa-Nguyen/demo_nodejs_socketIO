$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io.connect('http://localhost:3000');

    function connect() {
        var username = $('#username').val();
        socket.emit('online', {username: username});
        $("#connect-form").css('display', 'none');
        $("#chat-body").css('display', 'block');
        $("#hello-title").html('Hello, ' + username);
    }
    // Gởi logout sự kiện
    $("#connect-btn").on('click', function () {
        connect();
    });

    $('#username').keyup(function(e){
        if (e.keyCode == 13) {
           connect(); 
        }
    });


    // Bắt logout sự kiện
    socket.on("online", function (data) {
        var user = data.username;
        if ($("#" + user).length == 0) {
            $("#list-user-active").append("<li id='" + user + "'>" + user + "</li>");

            $("#message-alert").css('display', 'block');
            $("#message-alert").text(user + ' is online!');
            setTimeout(function(){
                $("#message-alert").css('display', 'none');
            }, 2000);

        }
    });

    // Gởi logout sự kiện
    $("#logout-btn").on('click', function () {
        var username = $('#username').val();
        socket.emit('logout', {username: username});
        location.reload(); 
    });

    // Bắt logout sự kiện
    socket.on("logout", function (data) {
        var user = data.username;
        $("#" + user).remove();
        $("#message-alert").css('display', 'block');
        $("#message-alert").text(user + ' is offline!');
        setTimeout(function(){
            $("#message").css('display', 'none');
        }, 2000);
    });

    //Socket nhận data và append vào giao diện
    socket.on("send", function (data) {
        $("#content").append("<p class='message'>" + data.username + ": " + data.message + "</p>");
    });

    function sendMsg() {
        var username = $('#username').val();
        var message = $('#message').val();
        console.log(username);
        console.log(message);

        if (username == '' || message == '') {
            alert('Please enter name and message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('send', {username: username, message: message});
            $('#message').val('');
        }
    }

    //Bắt sự kiện click gửi message
    $("#send-btn").on('click', function () {
        sendMsg();
    });

    $('#message').keyup(function(e){
        if (e.keyCode == 13) {
           sendMsg(); 
        }
    });
})