from flask import Flask, render_template
from flask_flatpages import FlatPages
import json

app = Flask(__name__, static_folder='static', template_folder='static/pages')
app.config['FLATPAGES_AUTO_RELOAD'] = True
app.config['FLATPAGES_EXTENSION'] = '.md'
app.config['FLATPAGES_ROOT'] = 'content'
pages = FlatPages(app)

questions = json.loads(open('./static/testing/questions.json').read())

@app.route('/resources')
def resources():
    posts = [p for p in pages if 'resources' in p.path]
    groups = sorted(set(post.meta.get('group') for post in posts if 'group' in post.meta))
    return render_template('resources.html', posts=posts, groups=groups)

@app.route('/resources/<path:path>')
def resource(path):
    page = pages.get_or_404(f'resources/{path}')
    return render_template('articlelayout.html', page=page)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route("/home", methods=['GET'])
def home():
    return render_template("home.html")

@app.route("/testing", methods=['GET'])
def testing():
    return render_template("testing.html")

@app.route("/datacollect", methods=['GET'])
def datacollect():
    return render_template("datacollect.html")

@app.route("/about-us", methods=['GET'])
def aboutus():
    return render_template("about-us.html")

@app.route("/confirmation", methods=['GET'])
def callibration():
    return render_template("confirmation.html")

@app.route("/visual-attention", methods=['GET'])
def images():
    return render_template("images.html")

@app.route("/continuous-inhibition", methods=['GET'])
def letters():
    return render_template("randomLetters.html")

@app.route("/interference", methods=['GET'])
def passage():
    return render_template("passage.html")

@app.route("/screening", methods=['GET'])
def screening():
    return render_template("screening.html", questions=questions)

@app.route("/results", methods=['GET'])
def results():
    return render_template("results.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3000,debug=True) 