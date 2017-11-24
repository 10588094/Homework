d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

   var legend = d3.select("#Laag_1")

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

  legend.append("text")
    .attr("x", 60)
    .attr("y", 240)
    .style("font-size", "16px")
    .text("10000000");


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
});
