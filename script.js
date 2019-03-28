let name = prompt('Enter your name')
while (name === ''){
    name = prompt('Name cannot be blank!')
}

const minus = document.querySelector('.minus'),
      plus = document.querySelector('.plus'),
      value = document.querySelector('.value'),
      users = document.querySelector('.users'),
      username = document.querySelector('.username'),
      message = document.querySelector('.message'),
      messages = document.querySelector('.messages'),
      send = document.querySelector('.send');

var websocket = new WebSocket("ws://localhost:8080/");

username.textContent = name

websocket.onopen = function (event) {
    websocket.send(JSON.stringify({'action': 'name', 'name': name}))
}

/*minus.onclick = function (event) {
    websocket.send(JSON.stringify({'action': 'minus'}));
}

plus.onclick = function (event) {
    websocket.send(JSON.stringify({'action': 'plus'}));
}*/

send.onclick = function (event) {
    msg = message.value
    websocket.send(JSON.stringify({'action': 'message', 'message': msg, 'sender': name}));
    message.value = ''
}

websocket.onmessage = function (event) {
    console.log("*******************************")
    data = JSON.parse(event.data);
    console.log("Data: ", data)

    switch (data['type']) {
        case 'users':
            users.textContent = (data['count'].toString() + " user" + (data['count'] == 1 ? "": "s"));
            break;

        /*case 'state':
            value.textContent = (data['value']);
            break;*/

        case 'message':
            list_of_messages = document.createElement('p')
            content = document.createTextNode(data['sender'] + '>> ' + data['msg'])
            list_of_messages.appendChild(content)
            messages.appendChild(list_of_messages)
            break;

        default:
            // console.log('Data:', data['type'])
            console.error("unsupported event ", data);
    }
}