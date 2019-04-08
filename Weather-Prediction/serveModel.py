
# =======
# Imports
# =======
import os
import pandas as pd
import numpy as np
import tensorflow as tf
# from model import createModel
from time import sleep
from flask import Flask, request, jsonify, Blueprint
from time import sleep
from sklearn.preprocessing import MinMaxScaler
# from sklearn.preprocessing import MinMaxScaler
# from tensorflow.keras.models import load_model
from subprocess import Popen, PIPE


df = None
app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def renderPredict():
	global df
	# We need 35 fields to get temperature prediction
	# valuesDict = dict({})
	
	with open("cityDropColumns.dat","r") as file:
		ignoreList = file.readline().strip()
	ignoreList = ignoreList.split(',')
	city=ignoreList[0]
	ignore = ignoreList[1:]
	for i in ignore:
		df = df.drop(i, axis=1)
		df[i] = 0
	# # print(df.values)
	print(df.head())
	data = []
	for i in range(0, 3):
		X = MinMaxScaler().fit_transform(df.values[i].reshape(-1,1)).reshape(-1, )
		
		params = '-l'+" ".join([str(x) for x in X])
		print(params)
		
		p = Popen(['./testing.py', params], stdout=PIPE, stderr=PIPE)
		newInput, err = p.communicate("")
		data.append({"date": df.index[i], "prediction": str(newInput)[1:]})

	print(data)
	return jsonify(data)


if __name__ == "__main__":
	print(("* Loading Keras model and Flask starting server...\nplease wait until server has fully started"))
	df = pd.read_csv('~/Documents/webProjects/IWP-Weather-App/Weather-Prediction/JaipurFinalCleanData.csv').set_index('date')

	# Drop the original columns
	df = df.drop(['meantempm','mintempm', 'maxtempm'], axis=1)
	
	# Testing set Mean Abs Error:  1.18
	# Testing set Mean Sq Error:  2.59
	
	app.run(debug=True, threaded=True, port=5000)
