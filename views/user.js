const socket = io();
var checkbox = document.getElementById("motor");
    checkbox.addEventListener("change",function(){
       socket.emit('motor',Number(this.checked));
    });

