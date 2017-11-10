/**
Naam: Daphne Witmer
Studentnummer: 10588094
Code:
**/

temps = []
dates = []
datesMs = []
years = []
months = []
days = []
x_dates = []
y_temps = []

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        console.log(response)

        // get data and split for , and enter
        var data = response.split(/[,/\n]/).splice(2);

        // create an array with dates
        datesRaw = data.filter(function (value, index) {
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

        // transform data into pixels on canvas
        var transformX = createTransform([datesMs[0], datesMs[365]], [50, canvas.width-50]);
        var transformY = createTransform([-100, 300], [canvas.height-50, 50]);
        for (var i = 0; i <= temps.length; i++) {
            x_dates[i] = transformX(datesMs[i]);
            y_temps[i] = transformY(temps[i]);
        }

        // draw graph line
        ctx.beginPath();
        for (var i = 0; i < temps.length; i++){
            ctx.moveTo(x_dates[i], y_temps[i]);
            ctx.lineTo(x_dates[i+1], y_temps[i+1]);
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // draw y-axis
        ctx.beginPath();
        ctx.moveTo(50,50);
        ctx.lineTo(50, 300);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // draw x-axis
        ctx.beginPath();
        ctx.moveTo(50,canvas.height-50);
        ctx.lineTo(canvas.width-50, canvas.height-50);
        ctx.stroke();

        // draw temperature lines on y-axis and temperature indicators
        for (var i = -50; i < 350; i+=50){
            ctx.beginPath();
            ctx.moveTo(50, transformY(i));
            ctx.lineTo(45, transformY(i));
            ctx.stroke();
            ctx.font = '10px anton';
            ctx.lineWidth = 1;
            ctx.fillText([i], 27, transformY(i));
        }

        start_months = [x_dates[0], x_dates[31], x_dates[60], x_dates[91], x_dates[121], x_dates[152], x_dates[182], x_dates[213], x_dates[244], x_dates[274], x_dates[305], x_dates[335], x_dates[365]];
        month_names = ['jan', 'feb', 'maart', 'apr', 'mei', 'juni', 'juli', 'aug', 'sept', 'okt', 'nov', 'dec', ' ']

        //draw date lines x-axis and month indicators
        for (var i = 0; i < start_months.length; i++){
            ctx.beginPath();
            ctx.moveTo(start_months[i], 300);
            ctx.lineTo(start_months[i], 305);
            ctx.stroke();
            ctx.font = '10px anton';
            ctx.lineWidth = 1;
            ctx.fillText(month_names[i], start_months[i] ,315);
        }

        // draw temperature line 0 celcius
        ctx.beginPath();
        ctx.moveTo(50, transformY(0));
        ctx.lineTo(canvas.width-50, transformY(0));
        ctx.strokeStyle = "red";
        ctx.lineWidth = 0.1;
        ctx.stroke();

        // text title
        ctx.font = '18px arial';
        ctx.fillText('Average Temperature, De Bilt (NL) 2016', 180, 40);

        // text temperatures
        ctx.font = '12px arial';
        ctx.fillText('Temperatures', 0, 35);

        // text dates
        ctx.font = '12px arial';
        ctx.fillText('Months', 240, 340);
   }
};
xhttp.open("GET", "KNMI_20161231.txt", true);
xhttp.send();