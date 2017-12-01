# Name: Daphne Witmer
# Student number: 10588094
# convert csv data to JSON
# same for Leeuwarden.csv

import json
import csv

# Open csv file and make a dict
with open('Maastricht.csv', 'r') as infile:
	fieldnames = ['station', 'date', 'averageTemp', 'minTemp', 'maxTemp']
	reader = csv.DictReader(infile, fieldnames)
	reader = list(reader)

    # Write data to an JSON file
	with open('Maastricht.json', 'w') as outfile:
		json.dump(reader, outfile)
