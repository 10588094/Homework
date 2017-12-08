/**
Naam: Daphne Witmer
Studentnummer: 10588094
An interactive scatterplot that shows the inequality,
life expectancy and population size by country for 2014.
Tutorial I used: https://bl.ocks.org/mbostock/3887118
**/

window.onload = function(){
    draw()
}

function draw(){
    // Set the dimensions of the canvas / plot
    var margin = {top: 30, right: 50, bottom: 50, left: 40},
        width = 850 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var rScale = d3.scale.sqrt()
        .range([0.3, 3])

    // set colors for the legend
    var color = d3.scale.category10();

    // Define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    // Add the d3 chart canvas
    var plot = d3.select(".plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Include data
    d3.json("HPIdata2016.json", function(error, data) {
        if (error) throw error;

        // Convert srings to numbers
    	data.forEach(function(d) {
        d.population = +d.population;
        d.inequality = +d.inequality;
        d.lifeExpectancy = +d.lifeExpectancy;
    	});
        console.log(data)

        // Set domain for x and y axis
    	x.domain(d3.extent(data, function(d) { return d.lifeExpectancy; })).nice();
    	y.domain(d3.extent(data, function(d) { return d.inequality; })).nice();

        // Make x axis
        plot.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
                .attr("class", "label")
                .attr("x", width/2)
                .attr("y", 40)
                .style("text-anchor", "middle")
                .style("font-size", "18px")
                .text("Life Expectancy");

        // Make y axis
        plot.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("class", "label")
                .attr("y", -10)
                .attr("x", -40)
                .style("text-anchor", "start")
                .style("font-size", "18px")
                .text("Inequality*")

    	// Apply dots
    	plot.selectAll(".dot")
    		.data(data.filter(function(d){ if(d.inequality && d.lifeExpectancy) return d ; }))
            .enter().append("circle")
        		.attr("class", "dot")
        		.attr("r", scaleDots)
        		.attr("cx", function(d) { return x(d.lifeExpectancy); })
        		.attr("cy", function(d) { return y(d.inequality); })
        		.style("fill", function(d) { return color(d.continent); })
                .style("opacity", 0.7)
        		.on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);

        // scale dots to population size
        function scaleDots(d) {
            return (rScale(d.population/10000000)); }

    	// Make dots interactive
        function handleMouseOver(d, i) {

    		// Change size and opacity
    		d3.select(this)
                .style("opacity", 1)
                .attr("r",function() { return scaleDots(d)*1.3; })

    		//Specify where to put label of text and apply text for country
    		plot.append("text")
                .attr("id", "info")
                .attr("x", 60)
                .attr("y", 50)
                .style("font-size", "28px")
                .text(function() {
    			    return d.country;
    		});

            //Specify where to put label of text and apply text for inequality
            plot.append("text")
                .attr("id", "info")
                .attr("x", 60)
                .attr("y", 80)
                .style("font-size", "16px")
                .text( function() {
    			    return "Inequality: " + d.inequality + " pm2.5";
    		});

            //Specify where to put label of text and apply text for lifeExpectancy
            plot.append("text")
                .attr("id", "info")
                .attr("x", 60)
                .attr("y", 100)
                .style("font-size", "16px")
                .text( function() {
    			    return "LifeExpect: " + d.lifeExpectancy;
    		});

    	 }

        // Turn size and opacity back to normal and remove text
    	function handleMouseOut(d, i) {
            d3.select(this)
            .style("opacity", 0.7)
            .attr ("r", scaleDots);
            d3.selectAll("#info").remove();
    	  }

        // Apply legend for continents
    	var legend = plot.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // Append collord rectangles for legend
    	legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)

        // Append text to lagend
    	legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    });
}
