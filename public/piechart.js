
var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2 - 10;

var data = d3.range(10).map(Math.random).sort(d3.descending);
console.log(data);


var dataArray = new Array; 
for(var o in local_data) { 
  dataArray.push(local_data[o]); 
}



var data = dataArray;
var color = d3.scale.category20();

var arc = d3.svg.arc()
    .outerRadius(radius);

var pie = d3.layout.pie();

var svg = d3.select(".piechart").append("svg")
    .datum(data)
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arcs = svg.selectAll("g.arc")
    .data(pie)
  .enter().append("g")
    .attr("class", "arc");

arcs.append("path")
    .attr("fill", function(d, i) { console.log(d); return color(i); })
  .transition()
    .ease("bounce")
    .duration(2000)
    .attrTween("d", tweenPie)
  .transition()
    .ease("elastic")
    .delay(function(d, i) { return 2000 + i * 50; })
    .duration(750)
    .attrTween("d", tweenDonut);

function tweenPie(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}

function tweenDonut(b) {
  b.innerRadius = radius * .6;
  var i = d3.interpolate({innerRadius: 0}, b);
  return function(t) { return arc(i(t)); };
}







