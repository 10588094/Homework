# Name: Daphne Witmer
# Student number: 10588094
# convert csv data to JSON
# same for Leeuwarden.csv

import json
import csv

# Open csv file and make a dict
with open('HPIdata2016.csv', 'r') as infile:
	fieldnames = ['HPIrank', 'country', 'continent', 'lifeExpectancy', 'wellbeing', 'inequality', 'population', 'HPIindex']
	reader = csv.DictReader(infile, fieldnames)
	reader = list(reader)

    # Write data to an JSON file
	with open('HPIdata2016.json', 'w') as outfile:
		json.dump(reader, outfile)
