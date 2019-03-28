#!/usr/bin/env python
# coding: utf-8

# In[1]:


from datetime import datetime, timedelta
import time
from collections import namedtuple
import pandas as pd
import requests
import matplotlib.pyplot as plt


# In[2]:


API_KEY = 'Insert API Key Here'
BASE_URL = "http://api.wunderground.com/api/{}/history_{}/q/26.9124,75.7873.json" #latitude and longitude of jaipur


# In[3]:


target_date = datetime(2018, 3, 12)
features = ["date", "meantempm", "meandewptm", "meanpressurem", "maxhumidity", "minhumidity", "maxtempm",
            "mintempm", "maxdewptm", "mindewptm", "maxpressurem", "minpressurem", "precipm"]
DailySummary = namedtuple("DailySummary", features) # date to be change after the getting the exact 500 dataset to increase further


# In[4]:


def extract_weather_data(url, api_key, target_date, days):
    records = []
    for _ in range(days):
        request = BASE_URL.format(API_KEY, target_date.strftime('%Y%m%d'))
        response = requests.get(request)
        if response.status_code == 200:
            print(response.json())
            data = response.json()['history']['dailysummary'][0]
            records.append(DailySummary(
                date=target_date,
                meantempm=data['meantempm'],
                meandewptm=data['meandewptm'],
                meanpressurem=data['meanpressurem'],
                maxhumidity=data['maxhumidity'],
                minhumidity=data['minhumidity'],
                maxtempm=data['maxtempm'],
                mintempm=data['mintempm'],
                maxdewptm=data['maxdewptm'],
                mindewptm=data['mindewptm'],
                maxpressurem=data['maxpressurem'],
                minpressurem=data['minpressurem'],
                precipm=data['precipm']))
        time.sleep(6)
        target_date += timedelta(days=1)
    return records


# In[10]:


records = extract_weather_data(BASE_URL, API_KEY, target_date, 10)


# In[ ]:


records += extract_weather_data(BASE_URL, API_KEY, target_date, 30)


# In[12]:


df = pd.DataFrame(records, columns=features).set_index('date')


# In[13]:


tmp = df[['meantempm', 'meandewptm']].tail(10)
tmp


# In[14]:


tmp = df[['meantempm', 'meandewptm']].head(10)
tmp


# In[ ]:


df.to_csv('JaipurRawData3.csv')


# In[17]:


df = pd.read_csv('JaipurRawData3.csv').set_index('date')


# In[21]:


tmp = df[['meantempm', 'meandewptm']].head(10)  
tmp 


# In[19]:


tmp = df[['meantempm', 'meandewptm']].tail(10)  
tmp 


# In[22]:


# 1 day prior
N = 1

# target measurement of mean temperature
feature = 'meantempm'

# total number of rows
rows = tmp.shape[0]

# a list representing Nth prior measurements of feature
# notice that the front of the list needs to be padded with N
# None values to maintain the constistent rows length for each N
nth_prior_measurements = [None]*N + [tmp[feature][i-N] for i in range(N, rows)]

# make a new column name of feature_N and add to DataFrame
col_name = "{}_{}".format(feature, N)
tmp[col_name] = nth_prior_measurements
tmp


# In[23]:


def derive_nth_day_feature(df, feature, N):
    rows = df.shape[0]
    nth_prior_meassurements = [None]*N + [df[feature][i-N] for i in range(N, rows)]
    col_name = "{}_{}".format(feature, N)
    df[col_name] = nth_prior_meassurements


# In[24]:


for feature in features:
    if feature != 'date':
        for N in range(1, 4):
            derive_nth_day_feature(df, feature, N)


# In[25]:


df.columns


# In[26]:


# make list of original features without meantempm, mintempm, and maxtempm
to_remove = [feature 
             for feature in features 
             if feature not in ['meantempm', 'mintempm', 'maxtempm']]

# make a list of columns to keep
to_keep = [col for col in df.columns if col not in to_remove]

# select only the columns in to_keep and assign to df
df = df[to_keep]
df.columns


# In[27]:


df.info()


# In[28]:


df = df.apply(pd.to_numeric, errors='coerce')
df.info()


# In[29]:


# Call describe on df and transpose it due to the large number of columns
spread = df.describe().T

# precalculate interquartile range for ease of use in next calculation
IQR = spread['75%'] - spread['25%']

# create an outliers column which is either 3 IQRs below the first quartile or
# 3 IQRs above the third quartile
spread['outliers'] = (spread['min']<(spread['25%']-(3*IQR)))|(spread['max'] > (spread['75%']+3*IQR))

# just display the features containing extreme outliers
spread.ix[spread.outliers,]


# In[30]:


get_ipython().run_line_magic('matplotlib', 'inline')
plt.rcParams['figure.figsize'] = [14, 8]
df.maxhumidity_1.hist()
plt.title('Distribution of maxhumidity_1')
plt.xlabel('maxhumidity_1')
plt.show()


# In[31]:


df.minpressurem_1.hist()
plt.title('Distribution of minpressurem_1')
plt.xlabel('minpressurem_1')
plt.show()


# In[32]:


# iterate over the precip columns
for precip_col in ['precipm_1', 'precipm_2', 'precipm_3']:
    # create a boolean array of values representing nans
    missing_vals = pd.isnull(df[precip_col])
    df[precip_col][missing_vals] = 0


# In[33]:


df = df.dropna()


# In[34]:


df.info()


# In[35]:


df.to_csv('JaipurFinalCleanData.csv')


# In[ ]:




