import * as d3 from "d3";

const builder = jsonData => {
  const width = 900;
  const height = 500;

  const tooltip = d3
    .select(".barsTable")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const svg = d3
    .select(".barsTable")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(width / 2 - 50))
    .attr("y", 80)
    .text("Gross Domestic Product");
  const GDP = jsonData.data.map(item => item[1]);
  const yearsDate = jsonData.data.map(item => new Date(item[0]));
  const gdpMax = d3.max(GDP);
  const maxYear = d3.max(yearsDate);

  const xAxisScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), maxYear])
    .range([0, width - 50]);
  const xAxis = d3.axisBottom(xAxisScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(40, 480)");

  const yAxisScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([height - 20, 5]);
  const yAxis = d3.axisLeft(yAxisScale);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(40, 0)");

  const gpdScale = d3
    .scaleLinear()
    .domain([0, gdpMax])
    .range([0, height - 25]);
  const gpdBars = GDP.map(item => gpdScale(item));

  d3.select("svg")
    .selectAll("rect")
    .data(gpdBars)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => jsonData.data[i][0])
    .attr("data-gdp", (d, i) => jsonData.data[i][1])
    .attr("x", (d, i) => xAxisScale(yearsDate[i]))
    .attr("y", (d, i) => height - d)
    .attr("width", width / jsonData.data.length)
    .attr("height", d => d)
    .style("fill", "#33adff")
    .attr("transform", "translate(40, -20)")
    .on("mouseover", (d, i) => {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0.9);
      tooltip
        .html(
          `Year: ${jsonData.data[i][0].slice(0, 4)} <br> GDP: $${
            jsonData.data[i][1]
          } Billion`
        )
        .attr("data-date", jsonData.data[i][0])
        .style("left", "300px")
        .style("top", "300px")
        .style("transform", "translateX(60px)");
    })
    .on("mouseout", (d, i) => {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0);
    });
};

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then(data => {
    return builder(data);
  })
  .catch(() => console.error("Something is wrong..."));
