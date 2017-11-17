/**
Naam: Daphne Witmer
Studentnummer: 10588094
An interactive barchart that show the average rainfall in 2015, The Bilt
Tutorial I used: https://bost.ocks.org/mike/bar/3/
**/

// Set the dimensions of the canvas / graph
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

// Add the d3 chart canvas
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Include data
d3.json("KNMI_2015.json", function(error, data) {
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.rainfall; })]);

    // Make x axis
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Make y axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 7)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Rain in mm");

    // Make bars
    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.rainfall); })
        .attr("height", function(d) { return height - y(d.rainfall); })
        .attr("width", x.rangeBand())

        // Change color of bars and show text when hovering over
        .on("mouseover",function(d, i) {
            d3.select(this).attr("r", 10).style("fill", "steelblue")
            chart.append("text")
                .attr("class", "toDelete")
                .attr("x", x(d.date) + (x.rangeBand()/2))
                .attr("y", y(d.rainfall - 2))
                .style("text-anchor", "middle")
                .text(d.rainfall)
            })
        .on("mouseout", function(d){
            d3.select(this).attr("r", 5.5).style("fill", "darkblue")
            d3.selectAll(".toDelete")
                .style("visibility", "hidden")
            })
});
