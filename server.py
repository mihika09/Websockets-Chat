import asyncio
import websockets
import json
import logging
import uuid


logging.basicConfig()

USERS = {}
ROOMS = {}


async def send_message(data, websocket):
	print("Data: ", data)
	msg = json.dumps({'type': 'message', 'sender': USERS[websocket]['name'], 'msg': data['message']})
	if ROOMS[data['room_id']]:
		await asyncio.wait([user.send(msg) for user in ROOMS[data['room_id']]])


async def notify_user(username, room_id):
	user_notification = json.dumps({'type': 'user', 'count': len(ROOMS[room_id]), 'name': username, 'room_id': room_id})
	if ROOMS[room_id]:
		await asyncio.wait([user.send(user_notification) for user in ROOMS[room_id]])


async def register(data, websocket):
	print("#################")
	id = uuid.uuid1()
	USERS[websocket] = {'id': id, 'name': data['username'], 'room_id': data['room_id']}
	if data['room_id'] not in ROOMS:
		ROOMS[data['room_id']] = []
	ROOMS[data['room_id']].append(websocket)

	print("ROOMS: ", ROOMS)

	await notify_user(data['username'], data['room_id'])


async def unregister(websocket):
	room_id = USERS[websocket]['room_id']
	msg = '{} has left the chat'.format(USERS[websocket]['name'])
	USERS.pop(websocket, None)
	ROOMS[room_id].remove(websocket)
	await notify_user(msg, room_id)


async def chat(websocket, path):
	notif = await websocket.recv()
	print("Notification: ", notif)
	data = json.loads(notif)
	print("Received username: ", data)
	await register(data, websocket)

	try:
		async for message in websocket:
			data = json.loads(message)
			print("Received data: ", data)
			if data['type'] == 'message':
				await send_message(data, websocket)

			else:
				logging.error('unsupported event: {}'.format(data))

	finally:
		await unregister(websocket)


if __name__ == '__main__':

	start_server = websockets.serve(chat, 'localhost', 8080)

	loop = asyncio.get_event_loop()
	server = loop.run_until_complete(start_server)
	try:
		loop.run_forever()
	except KeyboardInterrupt:
		print("Shutting Down Server...")
	finally:
		server.close()
		loop.run_until_complete(server.wait_closed())
		loop.close()
