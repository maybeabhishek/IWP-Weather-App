class PrintDot(tf.keras.callbacks.Callback):
	def on_epoch_end(self, epoch, logs):
		print("Epoch: {} of {}".format(epoch, EPOCHS))

checkpointPath = "./checkpoint/model.ckpt"
checkpoint_dir = os.path.dirname(checkpointPath)
cp_callback = tf.keras.callbacks.ModelCheckpoint(checkpointPath, verbose=1)
early_stop = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=100)

