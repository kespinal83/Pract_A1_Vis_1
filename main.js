var margin = {top: 70, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#d3-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("./data.json", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);

  var x = d3.scaleLinear()
    .domain([0, 50])
    .range([ 0, width ]);
   svg.append("g")
    .attr("class", "myXaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0");

  var y = d3.scaleLinear()
    .domain([0,50])
    .range([height, 10]);
   svg.append("g")
   .attr("class", "myYaxis")
    .call(d3.axisLeft(y))
    .attr("opacity", "0");

  var z = d3.scaleLinear()
    .domain([0, 70])
    .range([ 1, 100]);

  var tooltip = d3.select("#d3-container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
  
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }
  
  var mousemove = function(d) {
    tooltip
      .html("During this month, There were this many art pieces: " + d.Genre_Count)
      .style("left", (d3.mouse(this)[0]+5) + "px") // Adjust the tooltip placement
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(raw_data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Month); } )
      .attr("cy", function (d) { return y(d.Place); } )
      .attr("r", function (d) { return z(d.Genre_Count); } )
//      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .attr("fill", d => {
        if (d.Genre_Count > 8) return "#4B584F";
       else if (d.Genre_Count <= 4) return "#FBE7DE";
        else return "#DCD19C";
      })

    // new X axis
    x.domain([0, 12])
    svg.select(".myXaxis")
      .transition()
      .duration(1000)
      .attr("opacity", "1")
      .call(d3.axisBottom(x));

        // new Y axis
    y.domain([0, 5])
    svg.select(".myYaxis")
      .transition()
      .duration(1000)
      .attr("opacity", "1")
      .call(d3.axisLeft(y));

    svg.selectAll("circle")
        .transition()
        .delay(function(d,i){return(i*3)})
        .duration(2000)
        .attr("cx", function (d) { return x(d.Month); } )
        .attr("cy", function (d) { return y(d.Place); } )
//        .attr("r", function (d) { return z(d.Genre_Count); } )

  })