const w = 960;
const h = 600;
const padding = 60;
const svg = d3.select("#container").append("svg")
              .attr("width", w).attr("height", h);
const legendsvg = d3.select("#legend").append("svg")
              .attr("width", 960).attr("height", 50);
const legendPadding = 10;

d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json") 
.then(function(data) {
    var root = d3.hierarchy(data).sum(function(d){ return d.value});

    var treeMap = d3.treemap()
        .size([w, h])
        .paddingInner(1);
    
    treeMap(root);

    const toolTip = d3
        .select("#container")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var color = d3.scaleOrdinal()
        .domain(["Action", "Drama", "Adventure", "Family", "Animation", "Comedy", "Biography"])
        .range(["#db8a00", "#75b0ff", "#13ad37", "#5d6d00", "#757582", "#d37cff", "#f96868"])

    svg.selectAll("rect")
        .data(root.leaves())
        .enter().append("rect")
        .attr("class", "tile")
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .style("stroke", "black")
        .style("fill", (d) => color(d.parent.data.name))
        .on("mouseover", (d, i) => {
            toolTip
              .transition()
              .duration(0)
              .style("opacity", 0.8);
            toolTip
              .attr("id", "tooltip")
              .html(function() {
              return "<span>" + "Name: " + d.data.name + "<br />" + "Category: " + d.data.category + "<br />" + "Value: " + d.data.value + "</span>";
            })
              .style("left", d3.event.pageX - 87.5 + "px") // -87.5 is half width of tooltip in css
              .style("top", d3.event.pageY - 75 + "px")
              .attr("data-value", d.data.value);
          })
           .on("mouseout", function(d) {
            toolTip
              .transition()
              .duration(0)
              .style("opacity", 0);
           });

  svg.append('text')
    .selectAll('tspan')
    .data(root.leaves())
    .enter()
    .append('tspan')
    .attr("x", (d) => d.x0 + 5)
    .attr("y", (d) => d.y0 + 20)
    .text( (d) => d.data.name)       //.html( (d) => d.data.name.replace(/\s/g, "<br>"))
    .attr("font-size", "0.6em")
    .attr("fill", "white");
console.log(root.leaves());
       /*svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0+5})    
          .attr("y", function(d){ return d.y0+20})   
          .text(function(d){ return d.data.name })
          .attr("font-size", "0.6em")
          .attr("fill", "white")*/
          
      legendsvg.selectAll('rect')
          .data(root.children)
          .enter()
          .append('rect')
          .attr('class', 'legend-item')
          .style('stroke', 'white')
          .attr('x', (d,i) => i*140 )
          .attr('width', 130)
          .attr('height', 20)
          .style('fill', d => color(d.data.name))
    
     legendsvg.selectAll('text')
            .data(root.children)
            .enter()
            .append('text')
            .attr('x', (d,i) => i*140)
            .attr('y', 40)
            .text(d => d.data.name);

      //had to change the legend below because it wouldn't pass fcc test
  /*legendsvg.append("g").classed("legend", true).classed("legend-item", true);
  const legend = d3.legendColor().shape("rect")
    .shapeWidth(90).cells(7).orient("horizontal").scale(color);
  legendsvg.select(".legend").call(legend);*/ 
});