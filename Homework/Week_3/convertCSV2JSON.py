# Name: Daphne Witmer
# Student number: 10588094
# convert csv data to JSON
# KNMI data is modified to show the average monthly rainfall

import json

# Open csv file
with open('KNMI_2015.csv', 'r') as infile:

    # Read data in an array
    data = []
    for line in infile:
        dataLine = line.rstrip().split(',')

        # Convert list to object
        convertedLine = {}
        convertedLine["date"] = dataLine[0]
        convertedLine["rainfall"] = float(dataLine[1])

        data.append(convertedLine)

    # Write data to an JSON file
    with open('KNMI_2015.json', 'w') as outfile:
        json.dump(data, outfile)
		



