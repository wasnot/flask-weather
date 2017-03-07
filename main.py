__author__ = 'wasnot'
import flask
import requests

app = flask.Flask(__name__)

@app.route("/")
def index():
    return "hello"

@app.route("/bye/<name>:<test>")
def bye(name, test):
    return "good bye "+ test +":"+ name +":"

@app.route("/sum/<a>:<b>")
def sum1(a, b):
    return str(sum(range(int(a),int(b))))

def func2(a, b):
    s = 0
    for x in range(a,b):
        s += x
    return s


@app.route("/weather/<city>")
def weather(city):
    url = "http://api.openweathermap.org/data/2.5/weather?q={0}&appid=bd82977b86bf27fb59a04b61b657fb6f"
    r = requests.get(url.format(city))
    weather_data = r.json()
    name = weather_data["name"]
    desc = weather_data["weather"][0]["description"]
    result = "name = {0}, weather = {1}".format(name, desc)
    return result

app.run(debug=True)