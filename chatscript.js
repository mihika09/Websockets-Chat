const username = document.getElementById('username')
const room = document.getElementById('room')
const msgBox = document.getElementById('typeMsg')
const screen = document.getElementById('chatDisplay')
username.focus()

let websocket = new WebSocket('ws://localhost:8080/')

room.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    websocket.send(JSON.stringify({ 'type': 'user_join', 'username': username.value, 'room_id': room.value }))
    username.hidden = true
    room.hidden = true
    msgBox.value = ''
    msgBox.focus()
  }
})

function notify (message) {
  let notification = document.createElement('p')
  notification.setAttribute('class', 'notification')
  notification.textContent = message
  screen.appendChild(notification)
}

msgBox.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && msgBox.value !== '') {
    websocket.send(JSON.stringify({ 'type': 'message', 'message': msgBox.value, 'room_id': room.value }))
    addMessage(msgBox.value, 'message')
  }
})

function addMessage (message, msgClass) {
  let msg = document.createElement('div')
  msg.setAttribute('class', msgClass)
  let content = document.createElement('p')
  content.textContent = message
  msg.appendChild(content)
  screen.appendChild(msg)
  msgBox.value = ''
  msgBox.focus()
}

websocket.onmessage = function (e) {
  const data = JSON.parse(e.data)
  switch (data['type']) {
    case 'user':
      let message = data['notification']
      notify(message)
      break

    case 'message':
      if (data['sender'] !== username.value) {
        let reply = data['msg']
        addMessage(reply, 'reply')
      }
      break

    default:
      console.error('unsupported event ', data)
  }
}
