const w = 1200;
const h = 600;
const padding = 60;
const svg = d3.select("#container").append("svg")
              .attr("width", w).attr("height", h);
const legendsvg = d3.select("#legend").append("svg")
              .attr("width", 670).attr("height", 40)
              .style("border-radius", "2px");
const legendPadding = 10;

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json") 
.then(function(data) {
  const baseTemp = data.baseTemperature;
  const dataSet = data.monthlyVariance;
  const minVariance = d3.min(dataSet, (d) => d.variance);
  const maxVariance = d3.max(dataSet, (d) => d.variance);
  const barWidth = w / dataSet.length;
  const barHeight = h / 12;
  
  const yearParse = d3.timeParse("%Y");
  const tempYears = dataSet.map( (d) => d.year);
  const yearFilter = tempYears.filter( (item, index) => tempYears.indexOf(item) === index);
  const monthFormat = d3.timeFormat("%B");
  const monthParse = d3.timeParse("%B");
  const tempMonths = dataSet.map( (d) => d.month);
  const monthFilter = tempMonths.filter( (item, index) => tempMonths.indexOf(item) === index);
  const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
  const months = monthsArr.map( (d) => new Date (monthParse(d)));
  console.log(months);
  const interpolatePlasma = d3.scaleSequential()
                  .domain([baseTemp + minVariance, baseTemp + maxVariance])
                  .interpolator(d3.interpolatePlasma);
  const scaleY = d3.scaleBand()
                  .domain(monthFilter)
                  .range([padding, h - padding]);
  
  const scaleAxisX = d3.scaleBand()
                .domain(yearFilter)
                .range([padding, w - padding]);
  
  const scaleAxisY = d3.scaleBand()
                .domain(months)
                .range([padding, h - padding]); 
  
  const xAxis = d3.axisBottom(scaleAxisX).tickValues(scaleAxisX.domain().filter( (d) => d % 10 === 0));
  const yAxis = d3.axisLeft(scaleAxisY).tickFormat(monthFormat);
  const xAxisGroup = svg.append("g")
     .attr("transform", "translate(0, " + (h - padding) + ")")
     .attr("id", "x-axis")
     .call(xAxis);
  const yAxisGroup = svg.append("g")
     .attr("transform", "translate(" + padding + ", 0)")
     .attr("id", "y-axis")
     .call(yAxis);
  const toolTip = d3
     .select("#container")
     .append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);
 
  svg.selectAll("rect").data(dataSet).enter().append("rect")
     .attr("x", (d, i) => scaleAxisX(d.year))
     .attr("y", (d, i) => scaleY(d.month))
     .attr("width", scaleAxisX.bandwidth())
     .attr("height", scaleAxisY.bandwidth())
     .attr("fill", (d, i) => interpolatePlasma(d.variance + baseTemp))  
     .attr("data-year", (d, i) => d.year)
     .attr("data-month", (d, i) => d.month - 1)
     .attr("data-temp", (d, i) => d.variance)
     .attr("class", "cell")
     .on("mouseover", function(d, i) {
      toolTip
        .transition()
        .duration(0)
        .style("opacity", 0.8);
      toolTip
        .attr("data-year", d.year)
        .attr("id", "tooltip")
        .html(function() {
        return "<span>" + monthFormat(d.month) + " " + d.year + "<br />" + "Variance " + (Math.round(d.variance * 100) / 100) + "℃" + "</span>";
      })
        .style("left", d3.event.pageX - 87.5 + "px") // -87.5 is half width of tooltip in css
        .style("top", d3.event.pageY - 75 + "px");
      })
      .on("mouseout", function(d) {
         toolTip
         .transition()
         .duration(0)
         .style("opacity", 0);
      });
   
   const legendScale = d3.scaleLinear()
        .domain([minVariance, maxVariance])
        .range([interpolatePlasma(minVariance + baseTemp), interpolatePlasma(maxVariance + baseTemp)]);
   legendsvg.append("g").attr("class", "legend");
   const legend = d3.legendColor().shape("rect")
        .shapeWidth(40).cells(16).orient("horizontal").scale(legendScale);
   legendsvg.select(".legend").call(legend);
});