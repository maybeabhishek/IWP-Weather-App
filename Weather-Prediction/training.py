
import os
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.metrics import explained_variance_score,     mean_absolute_error,     median_absolute_error
from sklearn.model_selection import KFold
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
from model import createModel

def getXY_transformed():
  df = pd.read_csv('~/Documents/webProjects/IWP-Weather-App/Weather-Prediction/JaipurFinalCleanData.csv').set_index('date')

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
  return X, y

def createModel():
	model = tf.keras.Sequential()
	model.add(tf.keras.layers.Dense(36, input_dim=36, kernel_initializer='normal', activation=tf.nn.relu))
	model.add(tf.keras.layers.Dense(20, activation='relu'))
	model.add(tf.keras.layers.Dense(20, activation='relu'))
	model.add(tf.keras.layers.Dense(1))
	optimizer = tf.keras.optimizers.RMSprop(0.001)

	model.compile(loss='mean_squared_error', optimizer=optimizer, metrics=['mean_squared_error', 'mean_absolute_error'])
	return model


checkpointPath = "./checkpoint/model.ckpt"
checkpoint_dir = os.path.dirname(checkpointPath)

# Get X and y after transformation
X, y = getXY_transformed()
print(X.shape, y.shape)


# Seperate data to training, validation and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=23)

regressor = createModel()
kfold = KFold(n_splits=10, random_state=43)

EPOCHS = 10000


class PrintDot(tf.keras.callbacks.Callback):
	def on_epoch_end(self, epoch, logs):
		print("Epoch: {} of {}".format(epoch, EPOCHS))

cp_callback = tf.keras.callbacks.ModelCheckpoint(checkpointPath, verbose=1)
early_stop = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=100)

history = regressor.fit(
	X_train, y_train,
	epochs=EPOCHS, validation_split=0.2, verbose=0,
	callbacks=[PrintDot(), cp_callback, early_stop])

hist = pd.DataFrame(history.history)
hist['epoch'] = history.epoch
hist.tail()


def plot_history(history):
	hist = pd.DataFrame(history.history)
	hist['epoch'] = history.epoch

	plt.figure()
	plt.xlabel('Epoch')
	plt.ylabel('Mean Abs Error')
	plt.plot(hist['epoch'], hist['mean_absolute_error'],
			 label='Train Error')
	plt.plot(hist['epoch'], hist['val_mean_absolute_error'],
			 label='Val Error')
	plt.ylim([0, 5])
	plt.legend()

	plt.figure()
	plt.xlabel('Epoch')
	plt.ylabel('Mean Square Error')
	plt.plot(hist['epoch'], hist['mean_squared_error'],
			 label='Train Error')
	plt.plot(hist['epoch'], hist['val_mean_squared_error'],
			 label='Val Error')
	plt.ylim([0, 20])
	plt.legend()
	plt.show()


plot_history(history)

loss, mse, mae= regressor.evaluate(X_test, y_test, verbose=0)
print(loss)
print("Testing set Mean Abs Error: {:5.2f}".format(mae))
print("Testing set Mean Sq Error: {:5.2f}".format(mse))


model_json = regressor.to_json()
with open("model.json", "w") as json_file:
    json_file.write(model_json)
# serialize weights to HDF5
regressor.save_weights("model.h5")
print("Saved model to disk")