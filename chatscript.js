const username = document.getElementById('username')
const room = document.getElementById('room')
const enterChat = document.getElementById('enterChat')
const msgBox = document.getElementById('typeMsg')
const screen = document.getElementById('chatDisplay')
let name

username.focus()
msgBox.value = ''
msgBox.disabled = true

let websocket = new WebSocket('ws://localhost:8080/')

room.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    websocket.send(JSON.stringify({ 'type': 'user_join', 'username': username.value, 'room_id': room.value }))
    enterChat.hidden = true
    msgBox.disabled = false
    name = username.value
    addToList(name)
    username.value = ''
    room.value = ''
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
    // addMessage(msgBox.value, 'message')
    // addMessage('test', 'reply', username.value)
  }
})

function addMessage (message, msgClass, sender = name) {
  let msg = document.createElement('div')
  msg.setAttribute('class', msgClass)
  let content = document.createElement('p')
  content.textContent = message
  if (msgClass === 'reply') {
    let user = document.createElement('span')
    user.textContent = sender
    msg.appendChild(user)
  }
  msg.appendChild(content)
  screen.appendChild(msg)
  msgBox.value = ''
  msgBox.focus()
}

function addToList (value) {
  let list = document.getElementById('chatList')
  let newUser = document.createElement('li')
  newUser.textContent = value
  list.appendChild(newUser)
}

websocket.onmessage = function (e) {
  const data = JSON.parse(e.data)
  switch (data['type']) {
    case 'user':
      let message = data['name'] !== name ? data['notification'] : 'You have joined the chat'
      notify(message)
      addToList(data['name'])
      break

    case 'message':
      if (data['sender'] !== name) {
        let reply = data['msg']
        addMessage(reply, 'reply', data['sender'])
      } else {
        addMessage(msgBox.value, 'message')
      }
      break

    default:
      console.error('unsupported event ', data)
  }
}
