const username = document.querySelector('#username')
const room = document.querySelector('#room')
const storage = window.localStorage
storage.setItem('roomId', JSON.stringify(room.value))
storage.setItem('username', JSON.stringify(username.value))

let websocket = new WebSocket('ws://localhost:8080/')

room.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    websocket.send(JSON.stringify({ 'type': 'user_join', 'username': username.value, 'room_id': room.value }))
    window.location.href = 'chat.html'
  }
})
