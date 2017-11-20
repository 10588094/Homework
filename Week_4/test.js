d3.xml("data.mprog.nl/course/30%20Homework/100%20D3%20Scatterplot/test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
});

var s = Snap();
Snap.load("https://data.mprog.nl/course/30%20Homework/100%20D3%20Scatterplot/test.svg", onSVGLoaded ) ;

function onSVGLoaded( data ){
    s.append( data );
}