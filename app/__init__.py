from flask import Flask, render_template


app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'gjr39dkjn344_!67#'


@app.route('/index')
def index():
	return render_template('chat.html')
