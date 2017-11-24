/**
Naam: Daphne Witmer
Studentnummer: 10588094
Legend test
**/

// Load test.svg in
d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    // Select Laag_1 to draw the legend on
    var legend = d3.select("#Laag_1")

    // Append missing rectangles for colors
	legend.append("rect")
       .attr("id", "kleur4")
       .attr("x", "13")
       .attr("y", "138.7")
       .attr("class", "st1")
       .attr("width", "21")
       .attr("height", "29")

	legend.append("rect")
       .attr("id", "kleur5")
       .attr("x", "13")
       .attr("y", "182.1")
       .attr("class", "st1")
       .attr("width", "21")
       .attr("height", "29")

	legend.append("rect")
       .attr("id", "kleur6")
       .attr("x", "13")
       .attr("y", "225.5")
       .attr("class", "st1")
       .attr("width", "21")
       .attr("height", "29")

    // fill colors
    d3.select("rect#kleur1.st1")
      .style("fill", "#ccece6")
    d3.select("rect#kleur2.st1")
      .style("fill", "#99d8c9")
    d3.select("rect#kleur3.st1")
      .style("fill", "#66c2a4")
    d3.select("rect#kleur4.st1")
      .style("fill", "#41ae76")
    d3.select("rect#kleur5.st1")
      .style("fill", "#238b45")
    d3.select("rect#kleur6.st1")
      .style("fill", "#005824")

   // append missing rectangles for text
   legend.append("rect")
        .attr("id", "tekst5")
        .attr("x", "46.5")
        .attr("y", "182.1")
        .attr("class", "st2")
        .attr("width", "119.1")
        .attr("height", "29")

    legend.append("rect")
        .attr("id", "tekst6")
        .attr("x", 46.5)
        .attr("y", 225.5)
        .attr("class", "st2")
        .attr("width", 119.1)
        .attr("height", 29)

    // Write text in rectangles
    legend.append("text")
        .attr("id", "cijfer1")
        .attr("x", 60)
        .attr("y", 32)
        .style("font-size", "16px")
        .text("100");

    legend.append("text")
        .attr("id", "cijfer2")
        .attr("x", 60)
        .attr("y", 75)
        .style("font-size", "16px")
        .text("1000");

    legend.append("text")
        .attr("id", "cijfer3")
        .attr("x", 60)
        .attr("y", 115)
        .style("font-size", "16px")
        .text("10000");

    legend.append("text")
        .attr("id", "cijfer4")
        .attr("x", 60)
        .attr("y", 160)
        .style("font-size", "16px")
        .text("100000");

    legend.append("text")
        .attr("id", "cijfer5")
        .attr("x", 60)
        .attr("y", 200)
        .style("font-size", "16px")
        .text("1000000");

    legend.append("text")
        .attr("id", "cijfer6")
        .attr("x", 60)
        .attr("y", 245)
        .style("font-size", "16px")
        .text("10000000");
});
