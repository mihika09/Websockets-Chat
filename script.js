const input = document.querySelector('#message_input'),
      users = document.querySelector('.users_count'),
      messages = document.querySelector('.messages');

users.hidden = true;

var websocket = new WebSocket('ws://localhost:8080/')

input.onkeyup = function(event){
    if (event.keyCode === 13){
        if (input.placeholder === 'Enter name'){
            websocket.send(JSON.stringify({'type': 'username', 'username': input.value}))
            input.value = ""
            input.placeholder = 'Enter message'
        }
        else {
            websocket.send(JSON.stringify({'type': 'message', 'message': input.value}))
            input.value=""
        }
    }
}

websocket.onmessage = function (event) {
    data = JSON.parse(event.data)
    console.log(data)
    switch (data['type']){
        case 'user':
            users.textContent = (data['count'].toString() + " user" + (data['count'] == 1 ? "": "s") + " online");
            users.hidden = false;
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

