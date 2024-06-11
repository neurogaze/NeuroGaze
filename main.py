from flask import Flask, render_template

app = Flask(__name__, static_folder='static', template_folder='static/pages')


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route("/home", methods=['GET'])
def home():
    return render_template("home.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3000,debug=True)