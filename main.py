from flask import Flask, render_template, request
from plotly.graph_objs import Scatter, Layout
import plotly

app = Flask(__name__)


@app.route("/")
def hello():
    return render_template("index.html")


host_addr = "127.0.0.1"
port_num = "8080"

app.run(host=host_addr, port=port_num)

# plotly graph to html
# plotly.offline.plot({
#     "data": [Scatter(x=[1, 2, 3, 4], y=[4, 3, 2, 1])],
#     "layout": Layout(title="hello world")
# })
