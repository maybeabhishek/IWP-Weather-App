import pandas as pd
from sklearn.preprocessing import MinMaxScaler

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
