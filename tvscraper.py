#!/usr/bin/env python
# Name: Daphne Witmer	
# Student number: 10588094
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating," \
			 "desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
'''Extract a list of highest rated TV series from DOM (of IMDB page).'''
	
	tvseries = []
	
	# Itteratie over items in DOM class for movie info (Rianne Schoon gave me
	# some tips here for genre and ratings)
	for tvserie in dom.by_class('lister-item-content'): 
	
		# Find titles in DOM and remove the 'u'
		title = tvserie.by_class('lister-item-header')[0].by_tag('a')[0].content
		title = title.encode('utf-8')
		
		# Find ratings in DOM and remove the 'u'
		rating = tvserie.by_class('ratings-bar')[0].by_class('inline-block.'
				 'ratings-imdb-rating')[0].by_tag('strong')[0].content
		rating = rating.encode('utf-8')
		
		# Find genre in DOM, remove the 'u', '\n' and spaces
		genre = tvserie.by_class('text-muted ')[0].by_class('genre')[0].content
		genre = genre.strip('\n').rstrip(' ').encode('utf-8')
		
		# Find runtime in DOM and remove the 'u' and 'min'
		runtime = tvserie.by_class('text-muted ')[0].by_class('runtime')[0].content 
		runtime = runtime.encode('utf-8').rstrip('min')
		
		# Find actors, itterate over actors for each movie, add them to a string
		# and remove 'u'
		i = 0
		temp = ""
		for i in range(4):
			temp += tvserie.by_tag('p')[2].by_tag('a')[i].content
			
			# Add ', ' between actors
			if i < 3:
				temp += ', '
			actors = temp.encode('utf-8')
			i += 1
			
		# Add extracted info to a list 
		info = []
		info.extend([title, rating, genre, actors, runtime])
		tvseries.append(info)  
		
	# Return list with info
	return [tvseries]

def save_csv(f, tvseries):
'''Output a CSV file containing highest rated TV-series.'''
	
	# Write collumn headers in the csv file
	writer = csv.writer(f)
	writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
	
	# Write list with tv-series to csv file
	for line in tvseries:
		writer.writerows(line)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
		
