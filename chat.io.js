function getUserName(text='Enter user name:'){
    var user = prompt(text, 'username')
    if (user === '' || user == null){
        getUserName('User name can\'t be empty, please enter username:');
    }
    return user
}

userList = []
function addChat(userID){
    alert(userID);
    $('#chats').append('<li class="nav-item"><a class="nav-link active" href="#">'+userID+'</a></li>')
}
$(document).ready(function() {
    var user = getUserName();
    $('#enterUserField').text(user);
    $('#enterUserField').prop('disabled', true);
	var socket = io.connect('http://localhost:5000');
	socket.on('connect', function() {
		socket.emit('newUser', user);
    });
    $('#msg-text').focus();
    socket.on('loggedUsers', function(usr){
        $('#loggedUsers').empty();
        for (var item of Object.keys(usr[1])){
            $('#loggedUsers').append('<li class="list-group-item" id="'+item+'"><a href="#" onclick="addChat('+item+');">'+item+'</a></li>')

        }
        $("#myMessages").append('<li>'+usr[0]+' has connected!</li>');
    });
	socket.on('message', function(msg) {
        $("#myMessages").append('<li>'+msg+'</li>');
        console.log('Received message');  
	});
	$('#msgForm').on('submit', function(e) {
        e.preventDefault();
        console.log($('#msg-text').val());
		socket.send($('#msg-text').val());
        $('#msg-text').val('');

    });
    $(window).on('beforeunload', function(){
        socket.emit('dc-user', user)
    });
    socket.on('dcUsers', function(usr){
        console.log('doing work');
        $('#loggedUsers').empty();
        for (var item of Object.keys(usr[1])){
            console.log(item);
            $('#loggedUsers').append('<li class="list-group-item" id="'+item+'"><a href="#" onclick="addChat('+item+');">'+item+'</a></li>')
        }

        $("#myMessages").append('<li>'+usr[0]+' has disconnected!</li>');

    });

});