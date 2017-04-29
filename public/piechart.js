/*
var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2 - 10;

var data = d3.range(10).map(Math.random).sort(d3.descending);
console.log(data);


var dataArray = new Array; 
for(var o in local_data) { 
  dataArray.push(local_data[o]); 
}



var arr = [
	{
	mood: 'happy',
	level:5
	},
	{
	mood: 'sleepy',
	level:3
	},
	{
	mood: 'sad',
	level:2
	}

	]


var data = dataArray;
var color = d3.scale.category20();

var arc = d3.svg.arc()
    .outerRadius(radius);

var pie = d3.layout.pie();

console.log(typeof pie)
//var yourGElement = vis.append("svg:g").attr("transform", "translate(40,0)");

//yourGElement.append("svg:title").text("Your tooltip info");
/*
var nestedData = d3.nest()
    .key(function(d) { return d.level; })
    .key(function(d) {return d.mood;})
    .entries(dataset);
*/
/*
var svg = d3.select(".piechart").append("svg")
    //.data(arr, function(d){ console.log(d); if(d){ return d.value }})
    .datum(dataArray)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

console.log(svg);

var arcs = svg.selectAll("g.arc")
    .data(pie)
    .enter().append("g")
    .attr("title", function(d, i) { console.log(d); return color(i); })
    .attr("class", "arc");


console.log(arcs);
    
arcs.append("path")
    .attr("fill", function(d, i) { return color(i); })
    .attr("title",  function(d, i) {  return color(i); })
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
  return function(t) { 
	 // console.log(b)
	  return arc(i(t)); };
}

/*
	var text = svg.select(".arc").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			console.log(d)
			return d.data.label;
		});


*/



