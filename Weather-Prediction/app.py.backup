
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
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
from flask import send_from_directory



app = Flask(__name__, static_url_path='')
graph = tf.get_default_graph()
model = None


def get_model_api():
	global model
	# tf.logging.set_verbosity(tf.logging.FATAL)
	if os.path.isfile("./modelNew.h5"):
		graph = tf.get_default_graph()
		model = load_model('modelNew.h5')
	else:
		print("Error: Model not found!\nRun training.py")
	model.build()

	def model_api(input_data):
		with graph.as_default():
			preds = model.predict(input_data)
		return preds
	return model_api

modelApi = get_model_api()


def init():
	global inputArr
	inputArr = np.array([[1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]])
	val = modelApi(inputArr)
	print(val)



@app.route('/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'static'), filename)

@app.route("/", methods=["POST", "GET"])
def renderPredict():
	# We need 35 fields to get temperature prediction
	# def getXY_transformed():
	
	# return X, y
	# meantempm_1=float(request.form['meantempm_1'])
	# meantempm_2=float(request.form['meantempm_2'])
	# meantempm_3=float(request.form['meantempm_3'])
	# meandewptm_1=float(request.form['meandewptm_1'])
	# meandewptm_2=float(request.form['meandewptm_2'])
	# meandewptm_3=float(request.form['meandewptm_3'])
	# meanpressurem_1=float(request.form['meanpressurem_1'])
	# meanpressurem_2=float(request.form['meanpressurem_2'])
	# meanpressurem_3=float(request.form['meanpressurem_3'])
	# maxhumidity_1=float(request.form['maxhumidity_1'])
	# maxhumidity_2=float(request.form['maxhumidity_2'])
	# maxhumidity_3=float(request.form['maxhumidity_3'])
	# minhumidity_1=float(request.form['minhumidity_1'])
	# minhumidity_2=float(request.form['minhumidity_2'])
	# minhumidity_3=float(request.form['minhumidity_3'])
	# maxtempm_1=float(request.form['maxtempm_1'])
	# maxtempm_2=float(request.form['maxtempm_2'])
	# maxtempm_3=float(request.form['maxtempm_3'])
	# mintempm_1=float(request.form['mintempm_1'])
	# mintempm_2=float(request.form['mintempm_2'])
	# mintempm_3=float(request.form['mintempm_3'])
	# maxdewptm_1=float(request.form['maxdewptm_1'])
	# maxdewptm_2=float(request.form['maxdewptm_2'])
	# maxdewptm_3=float(request.form['maxdewptm_3'])
	# mindewptm_1=float(request.form['mindewptm_1'])
	# mindewptm_2=float(request.form['mindewptm_2'])
	# mindewptm_3=float(request.form['mindewptm_3'])
	# maxpressurem_1=float(request.form['maxpressurem_1'])
	# maxpressurem_2=float(request.form['maxpressurem_2'])
	# maxpressurem_3=float(request.form['maxpressurem_3'])
	# minpressurem_1=float(request.form['minpressurem_1'])
	# minpressurem_2=float(request.form['minpressurem_2'])
	# minpressurem_3=float(request.form['minpressurem_3'])
	# precipm_1=float(request.form['precipm_1'])
	# precipm_2=float(request.form['precipm_2'])
	# precipm_3=float(request.form['precipm_3'])
	# print(request.form)
	
	# inputArr = np.array([[1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]])
	# inputArr = X[0]
	newInput = np.array([[1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]])
	print(newInput)
	print(newInput.shape)
	with graph.as_default():
			preds = model.predict(newInput)
	# modelApi(newInput)
	print(preds)
	# print(val)
	return "Hello"

# @app.route("/", defaults={'path':''})
# @app.route("/<path:path>")
# def return404(path):
# 	return "404 Not Found!"

if __name__ == "__main__":
		newInput = np.array([[1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]])
		print(newInput)
		print(newInput.shape)
		with graph.as_default():
			preds = model.predict(newInput)
		print(preds)
		print(("* Loading Keras model and Flask starting server...\nplease wait until server has fully started"))
		init()
		app.run(debug=True, threaded=True, port=5000)
