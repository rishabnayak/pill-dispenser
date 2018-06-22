const socket = io();
$('#form').submit(function(){
    socket.emit('setup', $('#text').val());
  });
