import asyncio
import websockets
import json
import logging
import uuid


logging.basicConfig()

USERS = {}


async def send_message(rcvd_msg, websocket):
	msg = json.dumps({'type': 'message', 'sender': USERS[websocket]['name'], 'msg': rcvd_msg})
	await asyncio.wait([user.send(msg) for user in USERS])


async def notify_user(msg):
	user_notification = json.dumps({'type': 'user', 'count': len(USERS), 'notification': msg})
	await asyncio.wait([user.send(user_notification) for user in USERS])


async def register(name, websocket):
	id = uuid.uuid1()
	USERS[websocket] = {'id': id, 'name': name}
	msg = '{} has joined the chat'.format(USERS[websocket]['name'])
	await notify_user(msg)


async def unregister(websocket):
	msg = '{} has left the chat'.format(USERS[websocket]['name'])
	USERS.pop(websocket, None)
	await notify_user(msg)


async def chat(websocket, path):
	name = await websocket.recv()
	n = json.loads(name)
	print("Received username: ", n)
	await register(n['username'], websocket)

	try:
		async for message in websocket:
			data = json.loads(message)
			print("Received data: ", data)
			if data['type'] == 'message':
				await send_message(data['message'], websocket)

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
