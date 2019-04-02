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



graph = tf.get_default_graph()
model = load_model('modelNew.h5')
inputArr = np.array([[1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]])
val = model.predict(inputArr)
print(val)