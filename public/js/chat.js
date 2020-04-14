$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io.connect('http://localhost:3000');

    function connect() {
        var username = $('#username').val();
        socket.emit('online', {username: username});
        $("#connect-form").css('display', 'none');
        $("#chat-body").css('display', 'block');
        $("#hello-title").html('Hello, ' + username);

        $.ajax({
            url: "getHistoryMsg",
            type: 'GET',
            success: function(res){
                $.each(res, function(i, data){
                    $("#content").append("<p class='message'>" + data.username + ", " 
                    + "<span style='color:#c1b7b7'>" + data.time + "</span>"
                    + ": " + data.message + "</p>");
                })
            }
        });
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
    socket.on("online", function (res) {
        renderListUserActive(res.users);
        alertMsg(res.username + ' is online!');
    });

    // Gởi logout sự kiện
    $("#logout-btn").on('click', function () {
        var username = $('#username').val();
        socket.emit('logout', {username: username});
        location.reload(); 
    });

    // Bắt logout sự kiện
    socket.on("logout", function (res) {
        renderListUserActive(res.users);
        alertMsg(res.username + ' is offline!');
    });

    function renderListUserActive(users) {
        $("#list-user-active").empty();
        $("#list-user-active").append("List user active:");
        $.each(users, function(i, data){
            var user = data.username;
            if ($("#" + user).length == 0) {
                $("#list-user-active").append("<li id='" + user + "'>" + user + "</li>");
            }
        });
    }

    function alertMsg(msg){
        $("#message-alert").css('display', 'block');
        $("#message-alert").text(msg);
        setTimeout(function(){
            $("#message-alert").css('display', 'none');
        }, 2000);
    }
    //Socket nhận data và append vào giao diện
    socket.on("send", function (data) {
        $("#content").append("<p class='message'>" + data.username + ", " 
            + "<span style='color:#c1b7b7'>" + data.time + "</span>"
            + ": " + data.message + "</p>");
    });

    function sendMsg() {
        var username = $('#username').val();
        var message = $('#message').val();

        if (username == '' || message == '') {
            alert('Please enter name and message!!');
        } else {
            var date = moment(); //Get the current date
            var time = date.format("HH:mm:ss");
            //Gửi dữ liệu cho socket
            socket.emit('send', {username: username, message: message, time: time});
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