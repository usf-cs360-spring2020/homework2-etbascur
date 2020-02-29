





  function parcoord(data) {

    // set the dimensions and margins of the graph
    let margin = {top: 30, right: 10, bottom: 10, left: 0},
      width = 960 ,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#parCoord")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

            // select the svg area

// Handmade legend
svg.append("circle").attr("cx",850).attr("cy",130).attr("r", 6).style("fill", "#e72445")
svg.append("circle").attr("cx",850).attr("cy",160).attr("r", 6).style("fill", "#3434c5")
svg.append("circle").attr("cx",850).attr("cy",190).attr("r", 6).style("fill", "green")
svg.append("text").attr("x", 870).attr("y", 130).text("CA").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 870).attr("y", 160).text("NY").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 870).attr("y", 190).text("TX").style("font-size", "15px").attr("alignment-baseline","middle")


  // Extract the list of dimensions we want to keep in the plot.
  dimensions = ["kq5_cond_parq1", "tier", "k_median"];
  // Color scale: colored by state to match
  let color = d3.scaleOrdinal()
    .domain(["CA","TX", "NY" ])
    .range([ "#e72445","green", "#3434c5"])

  // For each dimension, I build a linear scale. I store all in a y object
  let y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[name]; }) )
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width-80])
    .padding(0.2)
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter().append("path")
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke",  function(d){ return( color(d.state))})
    .style("opacity", 0.5)

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

}
