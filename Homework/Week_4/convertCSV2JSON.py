# Name: Daphne Witmer
# Student number: 10588094
# convert csv data to JSON
# Data from several source compbined in one CSV:
# pollution: http://apps.who.int/gho/data/view.main.SDGPM25116v?lang=en
# populatie: https://data.worldbank.org/indicator/SP.POP.TOTL?end=2014&name_desc=false&start=2013
# lifeExpectancy: http://apps.who.int/gho/data/node.main.688?lang=en

import json
import csv

# Open csv file and make a dict 
with open('data.csv', 'r') as infile:
	fieldnames = ['continent', 'country', 'pollution', 'population', 'lifeExpectancy']
	reader = csv.DictReader(infile, fieldnames)
	reader = list(reader)

    # Write data to an JSON file
	with open('data.json', 'w') as outfile:
		json.dump(reader, outfile)
