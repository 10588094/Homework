/**
Naam: Daphne Witmer
Studentnummer: 10588094
Code:
**/

// single line commands - air bnb
// closure
// last data = NaN (wrong range in for loop?)

temps = []
dates = []
datesMs = []
years = []
months = []
days = []
x_dates = []
y_temps = []

// get data and split for , and enter
dataRaw = document.getElementById("dataRaw").innerHTML;
var data = dataRaw.split(/[,/\n]/).splice(2);

// create an array with dates
datesRaw = data.filter(function (value, index) { // vragen wat functie precies is, hoe het werkt etc
    return index % 2 == 0;
} );

// create an array with temperatures
tempsRaw = data.splice(1).filter(function (value, index) {
    return index % 2 == 0;
} );

// convert temperatures from strings to numbers
for (var i = 0; i < tempsRaw.length; i++) {
        temps.push(Number(tempsRaw[i]));
}

// convert date strings to date time stamp
for (var i = 0; i < datesRaw.length; i++) {
        years.push(datesRaw[i].slice(0,4))
        months.push(datesRaw[i].slice(4,6))
        days.push(datesRaw[i].slice(6,8))
        dates.push(new Date(years[i] + "-" + months[i] + "-" + days[i]))
        datesMs.push(dates[i].getTime())
}

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var transformX = createTransform([datesMs[0], datesMs[365]], [canvas.width, 0]);
var transformY = createTransform([-150, 400], [0, canvas.height]);
for (var i = 0; i < temps.length; i++) {
    x_dates.push(transformX(datesMs[i]));
    y_temps.push(transformY(temps[i]));
}

console.log(canvas.height, canvas.width)
console.log(temps)

ctx.beginPath();
for (var i = 0; i < temps.length; i++){
    ctx.moveTo(x_dates[i], y_temps[i]);
    ctx.lineTo(x_dates[i+1], y_temps[i+1]);
    ctx.stroke();
}

// draw y-axis
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(0, 300);
ctx.stroke();

// draw x-axis
ctx.beginPath();
ctx.moveTo(0,canvas.height);
ctx.lineTo(canvas.width, canvas.height);
ctx.stroke();

// text
ctx.font = '20px anton';
ctx.textAlign = "left";
ctx.fillText('Average Temperature, Bilt (NL) 2016', 190, 30);
