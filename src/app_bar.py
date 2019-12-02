from flask import Flask, request, render_template, send_file
import json

app = Flask(__name__,template_folder='./templates')

@app.route('/',methods=['GET'])
def index():
    # data = json.load(open('../data/thanksgiving.json'))
    # print(len(data))
    return render_template('bar-chart.html')

@app.route('/graph', methods=['POST'])
def graph():
    origin = request.form['orign']
    destination = request.form['destination']
    print(origin, destination)
    # your code
    # return a response

if __name__ == "__main__":
    app.run(debug=True)