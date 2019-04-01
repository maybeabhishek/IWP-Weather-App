
# =======
# Imports
# =======
import os
import pandas as pd
import numpy as np
import tensorflow as tf
from model import createModel
from time import sleep
from flask import Flask, request, jsonify
from time import sleep
import tensorflow as tf

app = Flask(__name__)
def init():
	tf.logging.set_verbosity(tf.logging.FATAL)

	if os.path.isfile("./model.h5"):
		print("INFO: Model found!")
		# load json and create model
		json_file = open('model.json', 'r')
		loaded_model_json = json_file.read()
		json_file.close()
		loaded_model = tf.keras.models.model_from_json(loaded_model_json)
		# load weights into new model
		loaded_model.load_weights("model.h5")
		model = loaded_model
		print("Loaded model from disk")
	else:
		print("Error: Model not found!\nRun training.py")


@app.route("/getPrediction")
def renderPredict():
	return "Hello"

if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server...\nplease wait until server has fully started"))
    init()
    app.run(threaded=True, port=8080)
