import asyncio
import websockets
import json
import logging

logging.basicConfig()

STATE = {'value': 0}
USERS = set()


def user_event():
	return json.dumps({'type': 'users', 'count': len(USERS)})


def state_event():
	return json.dumps({'type': 'state', **STATE})


async def notify_users():
	if USERS:
		message = user_event()
		await asyncio.wait([user.send(message) for user in USERS])


async def notify_state():
	if STATE:
		message = state_event()
		await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
	USERS.add(websocket)
	await notify_users()


async def unregister(websocket):
	USERS.remove(websocket)
	await notify_users()


async def counter(websocket, path):
	await register(websocket)
	try:
		await websocket.send(state_event())
		async for message in websocket:
			data = json.loads(message)

			if data['action'] == 'minus':
				STATE['value'] -= 1
				await notify_state()

			elif data['action'] == 'plus':
				STATE['value'] += 1
				await notify_state()

			else:
				logging.error('unsupported event: {}', data)
	finally:
		await unregister(websocket)


start_server = websockets.serve(counter, 'localhost', 8080)


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
