import tensorflow as tf
def createModel():
	model = tf.keras.Sequential()
	model.add(tf.keras.layers.Dense(36, input_dim=36, kernel_initializer='normal', activation=tf.nn.relu))
	model.add(tf.keras.layers.Dense(20, activation='relu'))
	model.add(tf.keras.layers.Dense(20, activation='relu'))
	model.add(tf.keras.layers.Dense(1))
	optimizer = tf.keras.optimizers.RMSprop(0.001)

	model.compile(loss='mean_squared_error', optimizer=optimizer, metrics=['mean_squared_error', 'mean_absolute_error'])
	return model
