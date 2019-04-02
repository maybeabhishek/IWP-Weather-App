
# =======
# Imports
# =======
import os
import pandas as pd
# import numpy as np
# import tensorflow as tf
# from model import createModel
from time import sleep
from flask import Flask, request, jsonify, Blueprint
from time import sleep
from sklearn.preprocessing import MinMaxScaler
# from sklearn.preprocessing import MinMaxScaler
# from tensorflow.keras.models import load_model
from subprocess import Popen, PIPE

app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def renderPredict():
	# We need 35 fields to get temperature prediction
	valuesDict = dict({})
	valuesDict["meantempm_1"]=float(request.form['meantempm_1'])
	valuesDict["meantempm_2"]=float(request.form['meantempm_2'])
	valuesDict["meantempm_3"]=float(request.form['meantempm_3'])
	valuesDict["meandewptm_1"]=float(request.form['meandewptm_1'])
	valuesDict["meandewptm_2"]=float(request.form['meandewptm_2'])
	valuesDict["meandewptm_3"]=float(request.form['meandewptm_3'])
	valuesDict["meanpressurem_1"]=float(request.form['meanpressurem_1'])
	valuesDict["meanpressurem_2"]=float(request.form['meanpressurem_2'])
	valuesDict["meanpressurem_3"]=float(request.form['meanpressurem_3'])
	valuesDict["maxhumidity_1"]=float(request.form['maxhumidity_1'])
	valuesDict["maxhumidity_2"]=float(request.form['maxhumidity_2'])
	valuesDict["maxhumidity_3"]=float(request.form['maxhumidity_3'])
	valuesDict["minhumidity_1"]=float(request.form['minhumidity_1'])
	valuesDict["minhumidity_2"]=float(request.form['minhumidity_2'])
	valuesDict["minhumidity_3"]=float(request.form['minhumidity_3'])
	valuesDict["maxtempm_1"]=float(request.form['maxtempm_1'])
	valuesDict["maxtempm_2"]=float(request.form['maxtempm_2'])
	valuesDict["maxtempm_3"]=float(request.form['maxtempm_3'])
	valuesDict["mintempm_1"]=float(request.form['mintempm_1'])
	valuesDict["mintempm_2"]=float(request.form['mintempm_2'])
	valuesDict["mintempm_3"]=float(request.form['mintempm_3'])
	valuesDict["maxdewptm_1"]=float(request.form['maxdewptm_1'])
	valuesDict["maxdewptm_2"]=float(request.form['maxdewptm_2'])
	valuesDict["maxdewptm_3"]=float(request.form['maxdewptm_3'])
	valuesDict["mindewptm_1"]=float(request.form['mindewptm_1'])
	valuesDict["mindewptm_2"]=float(request.form['mindewptm_2'])
	valuesDict["mindewptm_3"]=float(request.form['mindewptm_3'])
	valuesDict["maxpressurem_1"]=float(request.form['maxpressurem_1'])
	valuesDict["maxpressurem_2"]=float(request.form['maxpressurem_2'])
	valuesDict["maxpressurem_3"]=float(request.form['maxpressurem_3'])
	valuesDict["minpressurem_1"]=float(request.form['minpressurem_1'])
	valuesDict["minpressurem_2"]=float(request.form['minpressurem_2'])
	valuesDict["minpressurem_3"]=float(request.form['minpressurem_3'])
	valuesDict["precipm_1"]=float(request.form['precipm_1'])
	valuesDict["precipm_2"]=float(request.form['precipm_2'])
	valuesDict["precipm_3"]=float(request.form['precipm_3'])
	print(valuesDict)
	df = pd.DataFrame(valuesDict, index=[0])
	with open("cityDropColumns.dat","r") as file:
		ignoreList = file.readline().strip()
	ignoreList = ignoreList.split(',')
	city=ignoreList[0]
	ignore = ignoreList[1:]
	for i in ignore:
		# df = df.drop(i, axis=1)
		df[i] = 0
	# print(df.values)
	X = MinMaxScaler().fit_transform(df.values[0].reshape(-1,1)).reshape(-1, )
	
	params = '-l'+" ".join([str(x) for x in X])
	print(params)
	
	p = Popen(['./testing.py', params], stdout=PIPE, stderr=PIPE)
	newInput, err = p.communicate("")
	# print(err)
	# newInput = subprocess.call(["", '-l', ''])
	# newInput = os.execl("testing.py", [1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6])
	print('preds', newInput)
	
	return str(newInput)


if __name__ == "__main__":
	print(("* Loading Keras model and Flask starting server...\nplease wait until server has fully started"))
	app.run(debug=True, threaded=True, port=5000)
