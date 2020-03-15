const w = 800;
const h = 400;
const padding = 50;
const svg = d3.select("#container").append("svg")
              .attr("width", w + padding).attr("height", h + padding);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json") 
.then(function(data) {
  const dateParse = d3.timeParse("%Y");
  const dates = data.map( (d) => new Date (dateParse(d.Year)));
  const timeFormat = d3.timeFormat("%M:%S");
  const timeParse = d3.timeParse("%M:%S")
  const times = data.map( (d) => timeParse(d.Time));

  const scaleX = d3.scaleTime()
                .domain([0, d3.max(dates)])
                .range([0, w])
  const scaleY = d3.scaleTime()
                .domain([0, d3.max(times)])
                .range([0, h]);
  
  const scaleAxisX = d3.scaleTime()
                .domain([d3.min(dates), d3.max(dates)])
                .range([0, w]);
  
  const scaleAxisY = d3.scaleTime()
                .domain(d3.extent(times))
                .range([h, 0]);
  
  const xAxis = d3.axisBottom(scaleAxisX);
  const yAxis = d3.axisLeft(scaleAxisY).tickFormat(timeFormat);
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
 
  svg.selectAll("circle").data(data).enter().append("circle")
     .attr("cx", (d, i) => scaleAxisX(dateParse(d.Year)) + padding)
     .attr("cy", (d, i) => h - scaleAxisY(timeParse(d.Time)))
     .attr("r", 6)
     .attr("fill", ( d, i) => d.Doping === "" ? "rgb(2, 124, 224)" : "rgb(226, 43, 6)")
     .attr("data-xvalue", (d, i) => dateParse(d.Year))
     .attr("data-yvalue", (d, i) => timeParse(d.Time))
     .attr("class", "dot")
     .on("mouseover", function(d, i) {
      div
        .transition()
        .duration(0)
        .style("opacity", 0.8);
      div
        .attr("data-year", dateParse(d.Year))
        .attr("id", "tooltip")
        .html(function() {
        return "<span>" + d.Name + ", " + d.Year + "<br>" + "Time: " + d.Time + "<br>" + d.Doping + "</span>";
      })
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
     .on("mouseout", function(d) {
      div
        .transition()
        .duration(0)
        .style("opacity", 0);
     }); 
});