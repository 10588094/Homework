/**
Naam: Daphne Witmer
Studentnummer: 10588094
A line graph that shows temperature in 2016 for Maastricht and Leeuwarden.
**/

// Show dropdown menu
function showMenu() {
    document.getElementById("dropdown").style.display='block';
}

// Hide dropdown menu
function hideMenu() {
	document.getElementById("dropdown").style.display='none';
}

window.onload = function(){
    graph()
}

function graph(){

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 50, bottom: 50, left: 40},
        width = 850 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Convert data to time format
    var parseTime = d3.time.format("%Y%m%d").parse

    // Set data for legend
    var color = (["#0252dd","#230077", "#078ff7"]),
        text = (["Maximum", "Average", "Minimum"]);

    // Set the ranges
    var x = d3.time.scale().rangeRound([0, width]);
        y = d3.scale.linear().rangeRound([height, 0]);

    // Define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    // Define the first line
    var line1 = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.maxTemp); });

    // Define the 2nd line
    var line2 = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.minTemp); });

    // Define the 3nd line
    var line3 = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.averageTemp); });

    // Add the graph to the canvas
    var graph = d3.select(".graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set data in the queue
    d3.queue()
        .defer(d3.json, 'Leeuwarden.json')
        .defer(d3.json, 'Maastricht.json')
        .await(loadData);

    // Load data
    function loadData(error, Leeuwarden, Maastricht) {
        if (error) throw error;

        data = Leeuwarden

        // Convert srings to numbers and date to date format
        Leeuwarden.forEach(function(d) {
        d.date = parseTime(d.date);
        d.maxTemp = +d.maxTemp/10;
        d.minTemp = +d.minTemp/10;
        d.averageTemp = +d.averageTemp/10;
        });

        Maastricht.forEach(function(d) {
        d.date = parseTime(d.date);
        d.maxTemp = +d.maxTemp/10;
        d.minTemp = +d.minTemp/10;
        d.averageTemp = +d.averageTemp/10;
        });

        // Change data on click
        d3.selectAll(".m")
        .on("click", function() { var station = this.getAttribute("value")
        if(station == "Leeuwarden"){ data = Leeuwarden }
        if(station == "Maastricht"){ data = Maastricht }
        hideMenu()
        d3.selectAll(".line").remove();

        drawLines(data, graph, line1, line2, line3)
        });

        // Set domain for x and y axis
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([
            d3.min(data, function(d) { return Math.min(d.minTemp); }),
            d3.max(data, function(d) { return Math.max(d.maxTemp); })
        ]);

        // Make x axis
        graph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)

        // Make y axis
        graph.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("class", "label")
                .attr("y", -10)
                .attr("x", -40)
                .style("text-anchor", "start")
                .style("font-size", "18px")
                .text("Temperature")

        // adding legend
        var legend = graph.append("g")
        	.attr("class","legend")
        	.attr("x", width - margin.right - 65)
        	.attr("y", 25)
        	.attr("height", 100)
        	.attr("width", 100);

        // Append Legend
        legend.selectAll("g").data(color)
            .enter()
            .append('g')
            .each(function(d,i){
            var g = d3.select(this);

        // Append rectangles for legend
        g.append("rect")
        	.attr("x", width - margin.right - 40)
        	.attr("y", i*25 + 10)
        	.attr("width", 10)
        	.attr("height",10)
        	.style("fill",color[i]);

        // Append text to legend
        g.append("text")
             .attr("x", width - margin.right - 25)
             .attr("y", i*25 + 20)
             .attr("height",30)
             .attr("width",100)
             .style("fill",color[i])
             .text(text[i]);
            });

    function drawLines(data, graph, line1, line2, line3) {

        // Add the line1 path.
        graph.append("path")
          .data([data])
          .attr("class", "line")
          .style("stroke", "#0252dd")
          .attr("d", line1)
          .on("mouseover", mouseover)

        // Add the line2 path.
        graph.append("path")
          .data([data])
          .attr("class", "line")
          .style("stroke", "#078ff7")
          .attr("d", line2)
          .on("mouseover", mouseover)

        // Add the line3 path.
        graph.append("path")
          .data([data])
          .attr("class", "line")
          .style("stroke", "#230077")
          .attr("d", line3)
          .on("mouseover", mouseover)

    // Show date for mouse loaction
    function mouseover(d) {
        d3.selectAll(".toDelete").remove()
        var mouse = d3.mouse(this)
        xDate = x.invert(mouse[0])
        graph.append("text")
            .attr("class", "toDelete")
            .attr("x", mouse[0])
            .attr("y", mouse[1])
            .style("text-anchor", "middle")
            .text(xDate.getDate() + "-" + xDate.getMonth())
        }

        }
    }
}
