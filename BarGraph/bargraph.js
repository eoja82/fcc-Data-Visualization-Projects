const w = 800;
const h = 400;
const barWidth = w / 275;
const padding = 50;
const svg = d3.select("#container")
  .append("svg")
  .attr("width", w + padding)
  .attr("height", h + padding);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(function (data) {
    const dates = data.data.map((d) => new Date(d[0]));
    const gdp = data.data.map((d) => d[1]);
    const scaleY = d3.scaleLinear()
      .domain([0, d3.max(gdp)])
      .range([0, h]);

    const scaleAxisX = d3.scaleTime()
      .domain([d3.min(dates), d3.max(dates)])
      .range([0, w]);

    const scaleAxisY = d3.scaleLinear()
      .domain([0, d3.max(gdp)])
      .range([h, 0]);

    const xAxis = d3.axisBottom(scaleAxisX);
    const yAxis = d3.axisLeft(scaleAxisY);
    const xAxisGroup = svg.append("g")
      .attr("transform", "translate(" + padding + ", " + h + ")")
      .attr("id", "x-axis")
      .call(xAxis);
    const yAxisGroup = svg.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .attr("id", "y-axis")
      .call(yAxis);
    const div = d3
      .select("#container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg.selectAll("rect").data(data.data).enter().append("rect")
      .attr("x", (d, i) => i * barWidth + padding)
      .attr("y", (d, i) => h - scaleY(d[1]))
      .attr("width", barWidth)
      .attr("height", (d, i) => scaleY(d[1]))
      .attr("fill", "rgb(2, 124, 224)")
      .attr("data-date", (d, i) => d[0])
      .attr("data-gdp", (d, i) => d[1])
      .attr("class", "bar")
      .on("mouseover", function (d, i) {
        div
          .transition()
          .duration(0)
          .style("opacity", 0.9);
        div
          .attr("data-date", data.data[i][0])
          .attr("id", "tooltip")
          .html(function () {
            return "<span>" + "$" + d[1] + " Billion " + "<br>" + d[0] + "</span>";
          })
          .style("left", d3.event.pageX - 75 + "px")
          .style("top", d3.event.pageY - 60 + "px");
      })
      .on("mouseout", function (d) {
        div
          .transition()
          .duration(0)
          .style("opacity", 0);
      });
  });