const w = 960;
const h = 600;
const padding = 60;
const svg = d3.select("#container").append("svg")
              .attr("width", w).attr("height", h);
const toolTip = d3
              .select("#container")
              .append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

let x = d3.scaleLinear()
    .domain([2.6, 75.1])
    .rangeRound([600, 860]);

let color = d3.scaleThreshold()
    .domain(d3.range(2.6, 75.1, (75.1-2.6)/8))
    .range(d3.schemeBlues[9]);

let g = svg.append("g")
    .attr("class", "key")
    .attr("id", "legend")
    .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(color.range().map(function(d) {
    d = color.invertExtent(d);
    if (d[0] == null) d[0] = x.domain()[0];
    if (d[1] == null) d[1] = x.domain()[1];
    return d;
  }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x) { return Math.round(x) + '%' })
    .tickValues(color.domain()))
    .select(".domain")
    .remove();

let us = null;
let education = null;

const promises = [d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"),
d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")];

Promise.all(promises).then(vals => {
    us = vals[0];
    education = vals[1];
    ready();
})

function ready() {
  const path = d3.geoPath();
  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("class", "county")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
        return education.find(el => el.fips === d.id).bachelorsOrHigher;
    })
    .attr("fill", (d) => {
        return color(education.find(el => el.fips === d.id).bachelorsOrHigher || 0);
    }) 
    .attr("d", path)
    .on("mouseover", function(d, i) {
      const item = education.find(el => el.fips === d.id);
      toolTip
        .transition()
        .duration(0)
        .style("opacity", 0.8);
      toolTip
        .attr("data-education", item ? item.bachelorsOrHigher : null)
        .attr("id", "tooltip")
        .html(function() {
            const result = education.filter( (obj) => obj.fips == d.id);
            if (result[0]) {
            return "<span>" + result[0]["area_name"] + ", " + result[0]["state"] + ": " + result[0].bachelorsOrHigher + "%" + "</span>";
            }
            return 0;
        })
        .style("left", d3.event.pageX -87.5 + "px") 
        .style("top", d3.event.pageY - 75 + "px");
    })
    .on("mouseout", function(d) {
    toolTip
      .transition()
      .duration(0)
      .style("opacity", 0);
    });
   
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
};