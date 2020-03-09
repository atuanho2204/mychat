var socket= io("https://chatchet.herokuapp.com");
//var socket = io("http://localhost:3000");

socket.on("server-send-false", function() {
    alert("Someone has taken this username. Please try again!!!");
});
socket.on("server-send-success", function(data) {
    $("#currentUser").html(data);
    $("#loginForm").hide(2000);
    $("#chatForm").show();
});

socket.on("server-send-listUser", function(data) {
    $("#boxContent").html("");
    data.forEach(function(i) {
        $("#boxContent").append("<div class='user'>" + i + "</div>");
    });
});

socket.on("server-send-listMessage", function(data) {
    var update = data[data.length - 1];
      $("#listMessages").append(
        "<div class='message'>" + update.user + ": " + update.message + "</div>"
      );
});

socket.on("server-someoneTexting", function(data) {
    $("#someoneTexting").html(data)
});

socket.on("server-someoneStopTexting", function(data) {
    $("#someoneTexting").html("")
});

$(document).ready(function() {
    $("#loginForm").show();
    $("#chatForm").hide();

    $("#btnRegister").click(function() {
        socket.emit("create-room", $("#txtRoomName").val());
        socket.emit("client-send-Username", $("#txtUserName").val());
    });

    $("#btnLogout").click(function() {
        console.log("hello");
        socket.emit("logOut");
        $("#loginForm").show(2000);
        $("#chatForm").hide();
    });

    $("#btnSendMessage").click(function() {
        if ($("#txtMessage").val() != "") {
            socket.emit("client-send-message", $("#txtMessage").val());
            $("#txtMessage").val("");
        }
    });

    $("#txtMessage").focusin(function() {
        socket.emit("someone-is-texting");
    });

    $("#txtMessage").focusout(function() {
        socket.emit("someone-stop-texting");
    });

});
