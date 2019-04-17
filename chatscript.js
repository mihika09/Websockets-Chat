const msgBox = document.getElementById('typeMsg')
const screen = document.getElementById('chatDisplay')
const roomId = window.localStorage.getItem('roomId')
msgBox.value = ''
msgBox.focus()

let websocket = new WebSocket('ws://localhost:8080/')

function notify (message) {
  let notification = document.createElement('p')
  notification.setAttribute('class', 'notification')
  notification.textContent = message
  screen.appendChild(notification)
}

msgBox.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && msgBox.value !== '') {
    websocket.send(JSON.stringify({ 'type': 'message', 'message': msgBox.value, 'room_id': roomId }))
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
      let reply = data['msg']
      addMessage(reply, 'reply')
      break

    default:
      console.error('unsupported event ', data)
  }
}
