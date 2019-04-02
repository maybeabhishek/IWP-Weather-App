# Load libraries
import flask
import pandas as pd
import tensorflow as tf
import tensorflow.keras as keras
from tensorflow.keras.models import load_model
import numpy as np

# instantiate flask 
app = flask.Flask(__name__)

# load the model, and pass in the custom metric function
global graph
graph = tf.get_default_graph()
model = load_model('modelNew.h5')

# define a predict function as an endpoint 
@app.route("/predict", methods=["GET","POST"])
def predict():
    data = {"success": False}

    params = flask.request.json
    if (params == None):
        params = flask.request.args
    x = np.array([[1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]])
    # if parameters are found, return a prediction
    # if (params != None):
        # x=pd.DataFrame.from_dict(params, orient='index').transpose()
    with graph.as_default():
        data["prediction"] = str(model.predict(x)[0][0])
        data["success"] = True

    # return a response in json format 
    return flask.jsonify(data)    

# start the flask app, allow remote connections 
app.run(host='0.0.0.0',port=7000)