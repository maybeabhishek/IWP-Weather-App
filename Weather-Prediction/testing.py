#!/usr/bin/env python3

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
import argparse

parser = argparse.ArgumentParser(description='Give results of weather predictions')
parser.add_argument('-l','--list', nargs='+', help='<Required> Set flag', required=True)
args = parser.parse_args()

# print(args.list)
params = [float(x) for x in args.list[0].split(' ')]
# print(params)
graph = tf.get_default_graph()
model = load_model('modelNew.h5')
inputArr = np.array([params])
val = model.predict(inputArr)
print(val[0][0],end='')