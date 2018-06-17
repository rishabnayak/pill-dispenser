const socket = io();
var checkbox = document.getElementByID("motor");
    checkbox.addEventListener("change",function(){
       socket.emit("motor",Number(this.checked));
    });
