const username = document.getElementById('username')
const room = document.getElementById('room')
const enterChat = document.getElementById('enterChat')
const msgBox = document.getElementById('typeMsg')
const screen = document.getElementById('chatDisplay')
const sendBtn = document.getElementById('sendMsg')
let name
let roomId
let color = 'rgb(' + random(3, 240) + ',' + random(3, 240) + ',' + random(3, 240) + ')'

username.focus()
msgBox.value = ''
msgBox.disabled = true

let websocket = new WebSocket('ws://localhost:8080/')

room.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    name = username.value
    roomId = room.value
    websocket.send(JSON.stringify({ 'type': 'user_join', 'username': name, 'room_id': roomId }))
    enterChat.hidden = true
    msgBox.disabled = false
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

function random (min, max) {
  let num = Math.floor(Math.random() * (max - min)) + min
  return num
}

function getTime () {
  let today = new Date()
  let hours = today.getHours()
  if (hours >= 12) {
    if (hours === 12) return hours + ':' + today.getMinutes() + ' p.m.'
    return (hours - 12) + ':' + today.getMinutes() + ' p.m.'
  }
  return today.getHours() + ':' + today.getMinutes() + ' a.m.'
}

sendBtn.addEventListener('click', () => {
  if (msgBox.value.trim() !== '') websocket.send(JSON.stringify({ 'type': 'message', 'message': msgBox.value, 'room_id': roomId }))
})

msgBox.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && msgBox.value.trim() !== '') {
    websocket.send(JSON.stringify({ 'type': 'message', 'message': msgBox.value, 'room_id': roomId }))
    addMessage(msgBox.value, 'message')
    addMessage('test', 'reply', name)
    addToList('test')
  }
})

function addMessage (message, msgClass, sender = name) {
  let msg = document.createElement('div')
  msg.setAttribute('class', msgClass)
  let content = document.createElement('span')
  content.textContent = message
  content.setAttribute('class', 'msgContent')
  if (msgClass === 'reply') {
    let user = document.createElement('p')
    user.setAttribute('class', 'sender')
    user.textContent = sender
    user.style.color = color
    msg.appendChild(user)
  }
  let time = document.createElement('span')
  time.setAttribute('class', 'msgTime')
  time.textContent = getTime()
  msg.appendChild(content)
  msg.appendChild(time)
  screen.appendChild(msg)
  msgBox.value = ''
  msgBox.focus()
}

function addToList (value) {
  let list = document.getElementById('chatList')
  let newUser = document.createElement('li')
  newUser.setAttribute('class', 'userDisplay')
  newUser.textContent = value
  list.appendChild(newUser)
}

websocket.onmessage = function (e) {
  const data = JSON.parse(e.data)
  switch (data['type']) {
    case 'user':
      let message = data['name'] !== name ? data['name'] + ' has joined the chat!' : 'You have joined the chat!'
      notify(message)
      addToList(data['name'])
      break

    case 'message':
      let msgType = data['sender'] !== name ? 'reply' : 'message'
      addMessage(data['msg'], msgType, data['sender'])
      break

    default:
      console.error('unsupported event ', data)
  }
}
