/**
Naam: Daphne Witmer
Studentnummer: 10588094
An interactive map that shows
map: https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json
vb: http://bl.ocks.org/jeremycflin/b43ab253f3ae02dced07
naast elkaar: http://bl.ocks.org/mattykuch/40ba19de703632ea2afbbc5156b9471f
**/
window.onload = function(){
    draw()
}

var plot;
var rScale;
var xPlot;
var yPlot;
var color;
var yAxis;

function draw(){
    // Set the dimensions of the canvas / plot
    var margin = {top: 30, right: 50, bottom: 50, left: 40},
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // Set the ranges
        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        rScale = d3.scale.sqrt()
            .range([0.3, 3])

        // set colors for the legend
        // var color = d3.scale.category10();

        //
        var colors = ['#ff0000', '#ff3700', '#ff6e00', '#ffc700', '#00ce00', '#97ce00'];

        //
        color = d3.scale.ordinal()
          .range(colors);

        var colorMap = d3.scale.linear()
        .domain([13.4, 44.7])
        .range(["red", "yellow"]);
        // "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"



    var projection = d3.geo.mercator()
                   .scale(100)
                   .translate( [width / 2, height / 1.5]);

    var path = d3.geo.path().projection(projection);

    //
    var map = d3.select(".map").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.queue()
        .defer(d3.json, "world-countries.json")
        .defer(d3.json, "HPIdata2016.json")
        .await(drawMap)

    function drawMap(error, data, HPIdata){
        if (error) throw error;

        HPIdata.forEach(function(d) {
        d.HPIindex = +d.HPIindex;
        d.population = +d.population;
        d.inequality = +d.inequality;
        d.lifeExpectancy = +d.lifeExpectancy;
        d.HPIrank = +d.HPIrank;
        d.wellbeing = +d.wellbeing;
        });


        var HPIindexByCountry = {};
        HPIdata.forEach(function(d) { HPIindexByCountry[d.country] = d.HPIindex; });

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
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);

        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        })
        .on('click', function(d){
            console.log(d.properties.name)
            d3.selectAll("."+d.properties.name)
                .style("fill", "blue")
        })

        // Set tooltips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>HPIrank: </strong><span class='details'>" + HPIindexByCountry[d.properties.name] +"</span>";
        })

        map.call(tip);

        // Set the dimensions of the canvas / plot
        var widthPlot = 650 - margin.left - margin.right,
            heightPlot = 400 - margin.top - margin.bottom;

        // Set the ranges
        xPlot = d3.scale.linear()
            .range([0, widthPlot]);

        yPlot = d3.scale.linear()
            .range([heightPlot, 0]);

        // Define the axis
        var xAxis = d3.svg.axis()
            .scale(xPlot)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(yPlot)
            .orient("left")

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

                    // scale dots to population size
                    function scaleDots(d) {
                        return (rScale(d.population/10000000)); }

                	// Make dots interactive
                    function handleMouseOver(d, i) {

                		// Change size and opacity
                		d3.select(this)
                            .style("opacity", 1)
                            .attr("r",function() { return scaleDots(d)*1.3; })

                		// Specify where to put label of text and apply text for country
                		plot.append("text")
                            .attr("id", "info")
                            .attr("x", 60)
                            .attr("y", 200)
                            .style("font-size", "24px")
                            .text(function() {
                			    return d.country;
                		});

                        // Specify where to put label of text and apply text for inequality
                        plot.append("text")
                            .attr("id", "info")
                            .attr("x", 60)
                            .attr("y", 220)
                            .style("font-size", "16px")
                            .text( function() {
                			    return "Inequality: " + d.inequality;
                		});

                        // Specify where to put label of text and apply text for lifeExpectancy
                        plot.append("text")
                            .attr("id", "info")
                            .attr("x", 60)
                            .attr("y", 235)
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
                        .attr("x", widthPlot - 18)
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color)

                    // Append text to lagend
                	legend.append("text")
                        .attr("x", widthPlot - 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                        .text(function(d) { return d; });


        }
    }

    function uploadData(){
        d3.selectAll(".dot").remove();
        d3.selectAll(".yText").remove();
        d3.selectAll("#yAxis").remove();

        d3.json("HPIdata2016.json", function(error, HPIdata) {
            if (error) throw error;

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
                    .text("HPI index*")

        // Apply dots
        plot.selectAll(".dot")
            .data(HPIdata.filter(function(d){ if(d.HPIindex && d.lifeExpectancy) return d ; }))
            .enter().append("circle")
                .attr("class", function(d){ return d.country + " dot";  })
                .attr("r", scaleDots)
                .attr("cx", function(d) { return xPlot(d.lifeExpectancy); })
                .attr("cy", function(d) { return yPlot(d.HPIindex); })
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

                    // Specify where to put label of text and apply text for country
                    plot.append("text")
                        .attr("id", "info")
                        .attr("x", 60)
                        .attr("y", 50)
                        .style("font-size", "24px")
                        .text(function() {
                            return d.country;
                    });

                    // Specify where to put label of text and apply text for inequality
                    plot.append("text")
                        .attr("id", "info")
                        .attr("x", 60)
                        .attr("y", 80)
                        .style("font-size", "16px")
                        .text( function() {
                            return "d.HPIindex: " + d.HPIindex;
                    });

                    // Specify where to put label of text and apply text for lifeExpectancy
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
    })
}

function uploadData2(){
    d3.selectAll(".dot").remove();
    d3.selectAll(".yText").remove();
    d3.selectAll("#yAxis").remove();

    d3.json("HPIdata2016.json", function(error, HPIdata) {
        if (error) throw error;

        // Make y axis
        plot.append("g")
            .attr("class", "y axis")
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

            // scale dots to population size
            function scaleDots(d) {
                return (rScale(d.population/10000000)); }

            // Make dots interactive
            function handleMouseOver(d, i) {

                // Change size and opacity
                d3.select(this)
                    .style("opacity", 1)
                    .attr("r",function() { return scaleDots(d)*1.3; })

                // Specify where to put label of text and apply text for country
                plot.append("text")
                    .attr("id", "info")
                    .attr("x", 60)
                    .attr("y", 200)
                    .style("font-size", "24px")
                    .text(function() {
                        return d.country;
                });

                // Specify where to put label of text and apply text for inequality
                plot.append("text")
                    .attr("id", "info")
                    .attr("x", 60)
                    .attr("y", 220)
                    .style("font-size", "16px")
                    .text( function() {
                        return "d.inequality: " + d.inequality;
                });

                // Specify where to put label of text and apply text for lifeExpectancy
                plot.append("text")
                    .attr("id", "info")
                    .attr("x", 60)
                    .attr("y", 240)
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
})
}
