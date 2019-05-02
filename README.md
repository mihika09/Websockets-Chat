# Websockets-Chat
A chat app using the websockets 7.0 library in Python. The rooms feature has been implmented, so only users present in the room can view the messages being sent in that room. 

## Requirements
Websockets-Chat requires Python ≥ 3.4.

## How to use:

Clone the repository and create and activate a python virtual environment inside the repository as follows:
```
python3 -m venv venv
source venv/bin/activate
```

Once the virtual environment has been activated, install the requirements.txt file as follows:
```
pip install -r requirements.txt
```

Now run the following commands on 2 different terminal windows (after activating the virtual environments on both the terminal windows):

```
python websockets_chat.py
python server.py
```

Navigate to localhost:5000/index on different browser windows and enter using a random username and room ID to enter a chatroom.
