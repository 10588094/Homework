# VERGEET HEADER NIET
# wat voor format moet de JSON data worden?
# is knmi nu csv file? (install plugins?)
# werkt versie 3 van D3 in python 3? of moet ik pyton 2.7 gebruiken?
# bron vermelding op website -> link nog beter

import json
import csv

f = open("KNMI_2015.txt", "r")
n = json.dumps(f)
o = json.loads(n)
# r = f.read()
# #print (type(r))
# j = json.dumps("r")
# print(j)

# data
with open('KNMI_2015.csv', 'r') as outfile:
    reader = csv.reader(line.replace)