const w = 960;
const h = 600;
const padding = 60;
const svg = d3.select("#container").append("svg")
  .attr("width", w).attr("height", h);
const legendsvg = d3.select("#legend").append("svg")
  .attr("width", 960).attr("height", 50);
const legendPadding = 10;

d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json")
  .then(function (data) {
    const root = d3.hierarchy(data).sum(function (d) { return d.value });

    const treeMap = d3.treemap()
      .size([w, h])
      .paddingInner(1);

    treeMap(root);

    const toolTip = d3
      .select("#container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const color = d3.scaleOrdinal()
      .domain(["Action", "Drama", "Adventure", "Family", "Animation", "Comedy", "Biography"])
      .range(["#db8a00", "#75b0ff", "#13ad37", "#5d6d00", "#757582", "#d37cff", "#f96868"])

    const cell = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .on("mouseover", (d, i) => {
        toolTip
          .transition()
          .duration(0)
          .style("opacity", 0.8);
        toolTip
          .attr("id", "tooltip")
          .html(function () {
            return "<span>" + "Name: " + d.data.name + "<br />" + "Category: " + d.data.category + "<br />" + "Value: " + d.data.value + "</span>";
          })
          .style("left", d3.event.pageX + 15 + "px")
          .style("top", d3.event.pageY + 15 + "px")
          .attr("data-value", d.data.value);
      })
      .on("mouseout", function (d) {
        toolTip
          .transition()
          .duration(0)
          .style("opacity", 0);
      });

    cell.append('rect')
      .attr("id", d => d.data.id)
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-value", d => d.data.value)
      .attr("data-category", d => d.data.category)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.category));

    cell.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("font-size", "8px")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + 10 * i)
      .text(d => d);

    legendsvg.selectAll("rect")
      .data(root.children)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .style("stroke", "white")
      .attr("x", (d, i) => i * 140)
      .attr("width", 130)
      .attr("height", 20)
      .style("fill", d => color(d.data.name))

    legendsvg.selectAll("text")
      .data(root.children)
      .enter()
      .append("text")
      .attr('x', (d, i) => i * 140)
      .attr('y', 40)
      .text(d => d.data.name);

  });