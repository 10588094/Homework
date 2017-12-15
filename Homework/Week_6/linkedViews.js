/**
Naam: Daphne Witmer
Studentnummer: 10588094
An interactive map and scatterplot that show HPI data
map: https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json
Used code for inspiration: http://bl.ocks.org/jeremycflin/b43ab253f3ae02dced07
**/

// A lot of global variables..
var plot;
var rScale;
var xPlot;
var yPlot;
var color;
var xAxis;
var yAxis;
var dataSet;
var HPIdataSet;
var margin;
var width;
var height;
var x;
var y;
var colorMap;
var projection;
var path;
var widthPlot;
var heightPlot;
var legendLabels;

window.onload = function() {

    margin = {top: 30, right: 50, bottom: 50, left: 40},
    // Set the dimensions of the canvas for the map
    width = 750 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Set the dimensions of the canvas for the plot
    widthPlot = 650 - margin.left - margin.right,
    heightPlot = 400 - margin.top - margin.bottom;

    // Set the ranges vor the map
    x = d3.scale.linear()
        .range([0, width]);

    y = d3.scale.linear()
        .range([height, 0]);

    // Set the ranges for the plot
    xPlot = d3.scale.linear()
        .range([0, widthPlot]);

    yPlot = d3.scale.linear()
        .range([heightPlot, 0]);

    // Define the axis for the plot
    xAxis = d3.svg.axis()
        .scale(xPlot)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(yPlot)
        .orient("left");

    rScale = d3.scale.sqrt()
        .range([0.3, 3]);

    legendDomain = ["13.4", "20", "27", "35", "44.7"];
    legendLabels = [">13.4", "20+", "27+", "35+", "<44.7"];
    legendColors = ['#ff0000', '#ff3200', '#ef5f00', '#ef9b00', '#efeb00']

    // set colors for the plot legend
    color = d3.scale.ordinal()
        .range(legendColors);

    // set colors for the map legend
    colorMap = d3.scale.threshold()
        .domain(legendDomain)
        .range(legendColors);

    // scale map
    projection = d3.geo.mercator()
        .scale(100)
        .translate([width / 2, height / 1.5]);

    path = d3.geo.path().projection(projection);

    // queue data
    d3.queue()
        .defer(d3.json, "world-countries.json")
        .defer(d3.json, "HPIdata2016.json")
        .await(initVis);
}

function initVis(error, data, HPIdata) {
    if (error) throw error;

    dataSet = data;
    HPIdataSet = HPIdata;

    // change data from string to numbers
    HPIdata.forEach(function(d) {
    d.HPIindex = +d.HPIindex;
    d.population = +d.population;
    d.inequality = +d.inequality;
    d.lifeExpectancy = +d.lifeExpectancy;
    d.HPIrank = +d.HPIrank;
    d.wellbeing = +d.wellbeing;
    });

    drawMap(data, HPIdata)
    drawPlot(HPIdata)
}

function drawMap(data, HPIdata) {

    // Add the d3 chart canvas
    var map = d3.select(".map").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // set HPI data by country to use in loop of map data
    var HPIindexByCountry = {};
    HPIdata.forEach(function(d) { HPIindexByCountry[d.country] = d.HPIindex; });

    var HPIrankByCountry = {};
    HPIdata.forEach(function(d) { HPIrankByCountry[d.country] = d.HPIrank; });

    var lifeExpectancyByCountry = {};
    HPIdata.forEach(function(d) { lifeExpectancyByCountry[d.country] = d.lifeExpectancy; });

    // Draw map
    map.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", function(d) { return colorMap(HPIindexByCountry[d.properties.name]); })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity", 0.8)

    // tooltips
    .style("stroke","white")
    .style('stroke-width', 0.3)
    .on('mouseover',function(d) {
      tip.show(d);

    d3.select(this)
        .style("opacity", 1)
        .style("stroke","white")
        .style("stroke-width",3);

    // interact with the plot by changing dots and show text
    d3.selectAll("."+d.properties.name)
        .style("opacity", 1)
        .attr("r",function(d) { return scaleDots(d)*1.3; })

        plot.append("text")
            .attr("id", "inf")
            .attr("x", 20)
            .attr("y", 300)
            .style("font-size", "16px")
            .text( function() { return d.properties.name + ": " + lifeExpectancyByCountry[d.properties.name] + " years"; });
    })

    .on('mouseout', function(d) {
        tip.hide(d);

        d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);

        d3.selectAll("."+d.properties.name)
            .style("opacity", 0.8)
            .attr ("r", scaleDots);

        d3.selectAll("#inf").remove();
    });

    // Set tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>HPIrank: </strong><span class='details'>" + HPIrankByCountry[d.properties.name] +"</span>";
    });

    map.call(tip);

    // Apply legend for HPI index
    var legendMap = map.selectAll(".legendMap")
        .data(legendColors)
        .enter().append("g")
        .attr("class", "legendMap")
        .attr("transform", function(d, i) { return "translate(0," + i * 22 + ")"; });

    // Append collored rects for legend
    legendMap.append("rect")
        .attr("x", width - 650)
        .attr("y", 340)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i){ return legendColors[i]; });

    // Append text to legend
    legendMap.append("text")
        .attr("x", width - 620)
        .attr("y", 350)
        .attr("dy", ".35em")
        .text(function(d, i){ return legendLabels[i]; });
}

function drawPlot(HPIdata){

    // Add the d3 chart canvas
    plot = d3.select(".plot").append("svg")
        .attr("width", widthPlot + margin.left + margin.right)
        .attr("height", heightPlot + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set domain for x and y axis
	xPlot.domain(d3.extent(HPIdata, function(d) { return d.lifeExpectancy; })).nice();
	yPlot.domain(d3.extent(HPIdata, function(d) { return d.inequality; })).nice();

    // Make x axis
    plot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightPlot + ")")
        .call(xAxis)
        .append("text")
            .attr("class", "label")
            .attr("x", widthPlot/2)
            .attr("y", 40)
            .style("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Life Expectancy");

    // Make y axis
    plot.append("g")
        .attr("class", "y axis")
        .attr("id", "yAxis")
        .call(yAxis)
        .append("text")
            .attr("class", "yText")
            .attr("y", -15)
            .attr("x", -40)
            .style("text-anchor", "start")
            .style("font-size", "18px")
            .text("Inequality*")

	// Apply dots
	plot.selectAll(".dot")
		.data(HPIdata.filter(function(d){ if(d.inequality && d.lifeExpectancy) return d ; }))
        .enter().append("circle")
    		.attr("class", function(d){ return d.country + " dot";  })
    		.attr("r", scaleDots)
    		.attr("cx", function(d) { return xPlot(d.lifeExpectancy); })
    		.attr("cy", function(d) { return yPlot(d.inequality); })
    		.style("fill", function(d) { return color(d.continent); })
            .style("opacity", 0.7)
    		.on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

    // Apply legend for continents
	var legendPlot = plot.selectAll(".legendPlot")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legendPlot")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // Append collord rects for legend
	legendPlot.append("rect")
        .attr("x", widthPlot - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)

    // Append text to legend
	legendPlot.append("text")
        .attr("x", widthPlot - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

function scaleDots(d) {

    // scale dots to population size
    return (rScale(d.population/10000000)); }


function handleMouseOver(d, i) {

    // Change size and opacity
    d3.select(this)
        .style("opacity", 1)
        .attr("r",function() { return scaleDots(d)*1.3; })

    // Specify where to put label of text and apply text for country
    plot.append("text")
        .attr("id", "info")
        .attr("x", 20)
        .attr("y", 250)
        .style("font-size", "24px")
        .text(function() { return d.country; });

    // Specify where to put label of text and apply text for inequality
    plot.append("text")
        .attr("id", "info")
        .attr("x", 20)
        .attr("y", 269)
        .style("font-size", "14px")
        .text( function() { return "Inequality: " + d.inequality; });

    // Specify where to put label of text and apply text for lifeExpectancy
    plot.append("text")
        .attr("id", "info")
        .attr("x", 20)
        .attr("y", 285)
        .style("font-size", "14px")
        .text( function() { return "Life expect: " + d.lifeExpectancy; });
}

// Turn size and opacity back to normal and remove text
function handleMouseOut(d, i) {
    d3.select(this)
    .style("opacity", 0.7)
    .attr ("r", scaleDots);
    d3.selectAll("#info").remove();
}

function uploadData(selection){

    // remove y axis and dots
    d3.selectAll(".dot").remove();
    d3.selectAll(".yText").remove();
    d3.selectAll("#yAxis").remove();

    if (selection == "Wellbeing") {

        // draw y axis for wellbeing
        yPlot.domain(d3.extent(HPIdataSet, function(d) { return d.wellbeing; })).nice();

        plot.append("g")
            .attr("class", "y axis")
            .attr("id", "yAxis")
            .call(yAxis)
            .append("text")
                .attr("class", "yText")
                .attr("y", -15)
                .attr("x", -40)
                .style("text-anchor", "start")
                .style("font-size", "18px")
                .text(selection + "*")

        // Apply dots for wellbeing
        plot.selectAll(".dot")
            .data(HPIdataSet)
            .enter().append("circle")
                .attr("class", function(d){ return d.country + " dot";  })
                .attr("r", scaleDots)
                .attr("cx", function(d) { return xPlot(d.lifeExpectancy); })
                .attr("cy", function(d) { return yPlot(d.wellbeing); })
                .style("fill", function(d) { return color(d.continent); })
                .style("opacity", 0.7)
                .on("mouseover", mouseOver)
                .on("mouseout", handleMouseOut);

        function mouseOver(d, i) {

            // Change size and opacity
            d3.select(this)
                .style("opacity", 1)
                .attr("r",function() { return scaleDots(d)*1.3; })

            // Specify where to put label of text and apply text for country
            plot.append("text")
                .attr("id", "info")
                .attr("x", 20)
                .attr("y", 250)
                .style("font-size", "24px")
                .text(function() { return d.country; });

            // Specify where to put label of text and apply text for welbeing
            plot.append("text")
                .attr("id", "info")
                .attr("x", 20)
                .attr("y", 269)
                .style("font-size", "14px")
                .text( function() { return "Wellbeing: " + d.wellbeing; });

            // Specify where to put label of text and apply text for lifeExpectancy
            plot.append("text")
                .attr("id", "info")
                .attr("x", 20)
                .attr("y", 285)
                .style("font-size", "14px")
                .text( function() { return "Life expect: " + d.lifeExpectancy; });
        }

        // hide info for inequality, show info for wellbeing
        d3.select(".inequalInfo")
            .style("display", "none");
        d3.select(".wellbeingInfo")
            .style("display", "inline");
    }

    if (selection == "Inequality") {

    // draw y axis for inequality
    yPlot.domain(d3.extent(HPIdataSet, function(d) { return d.inequality; })).nice();

    plot.append("g")
        .attr("class", "y axis")
        .attr("id", "yAxis")
        .call(yAxis)
        .append("text")
            .attr("class", "yText")
            .attr("y", -15)
            .attr("x", -40)
            .style("text-anchor", "start")
            .style("font-size", "18px")
            .text(selection + "*")

    // apply dots for inequality
    plot.selectAll(".dot")
        .data(HPIdataSet.filter(function(d){ if(d.inequality && d.lifeExpectancy) return d ; }))
        .enter().append("circle")
            .attr("class", function(d){ return d.country + " dot";  })
            .attr("r", scaleDots)
            .attr("cx", function(d) { return xPlot(d.lifeExpectancy); })
            .attr("cy", function(d) { return yPlot(d.inequality); })
            .style("fill", function(d) { return color(d.continent); })
            .style("opacity", 0.7)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

    // show info for inequality, hide info for wellbeing
    d3.select(".inequalInfo")
        .style("display", "inline");
    d3.select(".wellbeingInfo")
        .style("display", "none");
    }
}
