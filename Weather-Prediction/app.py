

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

model = None
app = Flask(__name__)
def init():
	global model
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


@app.route("/getPrediction", methods=["POST"])
def renderPredict():
	# We need 35 fields to get temperature prediction
	# def getXY_transformed():
  df = pd.read_csv('JaipurFinalCleanData.csv').set_index('date')

  # Drop the original columns
  df = df.drop(['mintempm', 'maxtempm'], axis=1)
  # Set X and y columns
  X = df[[col for col in df.columns if col != 'meantempm']]
  y = df['meantempm']
  
  X = X.values
  y = y.values.reshape(-1,1)
  minMaxScalerX = MinMaxScaler()
  minMaxScalerY = MinMaxScaler()
  X = minMaxScalerX.fit_transform(X)
  # return X, y
	meantempm_1=float(request.form['meantempm_1'])
	meantempm_2=float(request.form['meantempm_2'])
	meantempm_3=float(request.form['meantempm_3'])
	meandewptm_1=float(request.form['meandewptm_1'])
	meandewptm_2=float(request.form['meandewptm_2'])
	meandewptm_3=float(request.form['meandewptm_3'])
	meanpressurem_1=float(request.form['meanpressurem_1'])
	meanpressurem_2=float(request.form['meanpressurem_2'])
	meanpressurem_3=float(request.form['meanpressurem_3'])
	maxhumidity_1=float(request.form['maxhumidity_1'])
	maxhumidity_2=float(request.form['maxhumidity_2'])
	maxhumidity_3=float(request.form['maxhumidity_3'])
	minhumidity_1=float(request.form['minhumidity_1'])
	minhumidity_2=float(request.form['minhumidity_2'])
	minhumidity_3=float(request.form['minhumidity_3'])
	maxtempm_1=float(request.form['maxtempm_1'])
	maxtempm_2=float(request.form['maxtempm_2'])
	maxtempm_3=float(request.form['maxtempm_3'])
	mintempm_1=float(request.form['mintempm_1'])
	mintempm_2=float(request.form['mintempm_2'])
	mintempm_3=float(request.form['mintempm_3'])
	maxdewptm_1=float(request.form['maxdewptm_1'])
	maxdewptm_2=float(request.form['maxdewptm_2'])
	maxdewptm_3=float(request.form['maxdewptm_3'])
	mindewptm_1=float(request.form['mindewptm_1'])
	mindewptm_2=float(request.form['mindewptm_2'])
	mindewptm_3=float(request.form['mindewptm_3'])
	maxpressurem_1=float(request.form['maxpressurem_1'])
	maxpressurem_2=float(request.form['maxpressurem_2'])
	maxpressurem_3=float(request.form['maxpressurem_3'])
	minpressurem_1=float(request.form['minpressurem_1'])
	minpressurem_2=float(request.form['minpressurem_2'])
	minpressurem_3=float(request.form['minpressurem_3'])
	precipm_1=float(request.form['precipm_1'])
	precipm_2=float(request.form['precipm_2'])
	precipm_3=float(request.form['precipm_3'])
	print(request.form)
	
	inputArr = np.array([[meantempm_1, meantempm_2, meantempm_3, meandewptm_1, meandewptm_2, meandewptm_3, meanpressurem_1, meanpressurem_2, meanpressurem_3, maxhumidity_1, maxhumidity_2, maxhumidity_3, minhumidity_1, minhumidity_2, minhumidity_3, maxtempm_1, maxtempm_2, maxtempm_3, mintempm_1, mintempm_2, mintempm_3, maxdewptm_1, maxdewptm_2, maxdewptm_3, mindewptm_1, mindewptm_2, mindewptm_3, maxpressurem_1, maxpressurem_2, maxpressurem_3, minpressurem_1, minpressurem_2, minpressurem_3, precipm_1, precipm_2, precipm_3]])
	print(inputArr)
	print(inputArr.shape)
	val = model.predict(X)
	print(val)
	return "Hello"

@app.route("/", defaults={'path':''})
@app.route("/<path:path>")
def return404(path):
	return "404 Not Found!"

if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server...\nplease wait until server has fully started"))
    init()
    app.run(threaded=True, port=5000)
