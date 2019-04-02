import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv('~/Documents/webProjects/IWP-Weather-App/Weather-Prediction/JaipurFinalCleanData.csv').set_index('date')
df = df.drop(['mintempm', 'maxtempm'], axis=1)
print(df.corr()['meantempm'])
plt.matshow(df.corr())
plt.show()