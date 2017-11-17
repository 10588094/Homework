# Name: Daphne Witmer
# Student number: 10588094
# code

#commends
# 0 er uit
# handmatig aangepast

import json

with open('KNMI_2015.csv', 'r') as infile:

    data = []
    for line in infile:
        dataLine = line.rstrip().split(',')

        convertedLine = {}
        convertedLine["date"] = dataLine[0]
        convertedLine["rainfall"] = float(dataLine[1])

        data.append(convertedLine)

    with open('KNMI_2015.json', 'w') as outfile:
        json.dump(data, outfile)



