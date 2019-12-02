import json
import pandas as pd
import numpy as np
data = []
import csv
import json
with open('thanksgiving.csv') as f, open('thanksgiving.json','w') as fw:
    a = [{k: v for k, v in row.items()}
        for row in csv.DictReader(f, skipinitialspace=True)]
    json.dump(a,fw)