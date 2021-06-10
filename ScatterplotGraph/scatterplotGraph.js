const w = 800;
const h = 500;
const padding = 50;
const svg = d3.select("#container").append("svg")
  .attr("width", w).attr("height", h);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(function (data) {
    const dateParse = d3.timeParse("%Y");
    const dates = data.map((d) => new Date(dateParse(d.Year)));
    const timeFormat = d3.timeFormat("%M:%S");
    const timeParse = d3.timeParse("%M:%S")
    const times = data.map((d) => timeParse(d.Time));

    const scalecy = d3.scaleTime()
      .domain(d3.extent(times))
      .range([h - padding, padding]);

    const scaleAxisX = d3.scaleTime()
      .domain(d3.extent(dates))
      .range([padding, w - padding]);

    const scaleAxisY = d3.scaleTime()
      .domain(d3.extent(times))
      .range([padding, h - padding]);  //this line to invert y-axis from normal scaley above

    const xAxis = d3.axisBottom(scaleAxisX);
    const yAxis = d3.axisLeft(scaleAxisY).tickFormat(timeFormat);
    const xAxisGroup = svg.append("g")
      .attr("transform", "translate(0, " + (h - padding) + ")")
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

    svg.selectAll("circle").data(data).enter().append("circle")
      .attr("cx", (d, i) => scaleAxisX(dateParse(d.Year)))
      .attr("cy", (d, i) => h - scalecy(timeParse(d.Time)))
      .attr("r", 6)
      .attr("fill", (d, i) => d.Doping === "" ? "rgb(2, 124, 224)" : "rgb(226, 43, 6)")
      .attr("data-xvalue", (d, i) => dateParse(d.Year))
      .attr("data-yvalue", (d, i) => timeParse(d.Time))
      .attr("class", "dot")
      .on("mouseover", function (d, i) {
        div
          .transition()
          .duration(0)
          .style("opacity", 0.9);
        div
          .attr("data-year", dateParse(d.Year))
          .attr("id", "tooltip")
          .html(function () {
            return "<span>" + d.Name + ", " + d.Year + "<br>" + "Time: " + d.Time + "<br>" + d.Doping + "</span>";
          })
          .style("left", d3.event.pageX - 100 + "px")
          .style("top", d3.event.pageY - 115 + "px");
      })
      .on("mouseout", function (d) {
        div
          .transition()
          .duration(0)
          .style("opacity", 0);
      });
  });