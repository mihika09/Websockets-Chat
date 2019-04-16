const users = document.querySelector('.users_count'),
      room_id = document.querySelector('.room_id'),
      username = document.querySelector('#username'),
      room = document.querySelector('#room'),
      enter = document.querySelector('#enter'),
      input_message = document.querySelector('#message'),
      messages = document.querySelector('.messages');

users.hidden = true;
room_id.hidden = true;
input_message.hidden = true;

var websocket = new WebSocket('ws://192.168.43.91:8080/')

room.onkeyup = function(event){
    if(event.keyCode === 13){
        websocket.send(JSON.stringify({'type': 'user_join', 'username': username.value, 'room_id': room.value}))
        console.log('Sent message')
        username.hidden = true
        room.hidden = true
        enter.hidden = true
    }
}

message.onkeyup = function (event) {
    if(event.keyCode === 13){
        websocket.send(JSON.stringify({'type': 'message', 'message': input_message.value, 'room_id': room.value}))
        input_message.value=""
    }
}
   /*     else {

            input.value=""
        }
    }
}*/

websocket.onmessage = function (event) {
    data = JSON.parse(event.data)
    console.log(data)
    switch (data['type']){
        case 'user':
            users.textContent = (data['count'].toString() + " user" + (data['count'] == 1 ? "": "s") + " online");
            users.hidden = false;
            room_id.textContent = ("Room ID: " + data['room_id'])
            room_id.hidden = false;
            message.hidden = false;
            user_notification = document.createElement('p')
            content = document.createTextNode(data['notification'])
            user_notification.appendChild(content)
            user_notification.style.color = 'green'
            messages.appendChild(user_notification)
            break;

        case 'message':
            message = document.createElement('p')
            content = document.createTextNode(data['sender']+ ': ' + data['msg'])
            message.appendChild(content)
            message.style.color = 'blue'
            messages.appendChild(message)
            break;

        default:
            // console.log('Data:', data['type'])
            console.error("unsupported event ", data);
    }
};

