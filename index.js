
/* Dimension for the choropleths */
let cWidth = 1600;
let cHeight = 40;
let cMargin = {top:10, bottom:20, right:0, left:0};
let cFWidth = cWidth + cMargin.left + cMargin.right;
let cFHeight = cHeight + cMargin.top + cMargin.bottom;

/* Dimension for the scatter charts */

let lWidth = 400;
let lHeight = 200;
let lMargin = {top:30, bottom:20, right:10, left:40};
let lFWidth = lWidth + lMargin.left + lMargin.right;
let lFHeight = lHeight + lMargin.top + lMargin.bottom;

d3.csv("Admission_Predict.csv").then(data => {
  cleanData(data);
  drawGraphs(data);
});

/*
Converts the data from string to int and float as necessary and sorts the
rows by ascending values of chance of admission.
*/
function cleanData(data) {
  // convert from string to appropriate types
  data.forEach(d => {
    d[data.columns[0]] = parseInt(d[data.columns[0]]);
    d[data.columns[1]] = parseInt(d[data.columns[1]]);
    d[data.columns[2]] = parseInt(d[data.columns[2]]);
    d[data.columns[3]] = parseInt(d[data.columns[3]]);
    d[data.columns[4]] = parseFloat(d[data.columns[4]]);
    d[data.columns[5]] = parseFloat(d[data.columns[5]]);
    d[data.columns[6]] = parseFloat(d[data.columns[6]]);
    d[data.columns[7]] = parseInt(d[data.columns[7]]);
    d[data.columns[8]] = parseFloat(d[data.columns[8]]);
  });

  // sort the data by ascending values of chance of admission
  data.sort((a,b) => a[data.columns[8]] - b[data.columns[8]]);
}

function drawGraphs(data) {
  let chartsDiv = d3.select("#charts");

  const chancesExtent = d3.extent(data.map(d=>d[data.columns[8]]));
  let scatterXscale = d3.scaleLinear()
                      .domain(chancesExtent)
                      .range([0, lWidth]);

  let xAxisSuffix = "-xAxis";
  let yAxisSuffix = "-yAxis";
  let scatterSuffix = "-scatter";

  // Draw 6 plots
  for(let i=1; i<7; i++) {
    let columnValues = data.map(d=>d[data.columns[i]]);
    let scatterYscale = d3.scaleLinear()
                        .domain(d3.extent(columnValues))
                        .range([lHeight, 0]);

    let scatterDiv = chartsDiv.append("div")
                .attr("class", "col s4");

    scatterDiv.append("div")
            .attr("class", "badge")
            .text(data.columns[i])

    let scatterId = data.columns[i].replace(" ", "-");

    let scatterSvg = scatterDiv.append("svg")
                            .attr("height", lFHeight)
                            .attr("width", lFWidth)
                            .attr("id", scatterId);

    scatterSvg.append("g")
              .attr("transform", `translate(${lMargin.left}, ${lMargin.top})`)
              .attr("id", scatterId + yAxisSuffix)
           .call(d3.axisLeft(scatterYscale));

    scatterSvg.append("g")
              .attr("transform", `translate(${lMargin.left}, ${lHeight + lMargin.top})`)
              .attr("id", scatterId + xAxisSuffix)
            .call(d3.axisBottom(scatterXscale));

    let scatterData = data.map(function(d) {
      return {
        x: d[data.columns[8]],
        y: d[data.columns[i]],
        id: d[data.columns[0]]
      }
    });

    scatterSvg.append("g")
                .attr("transform", `translate(${lMargin.left}, ${lMargin.top})`)
                .attr("id", scatterId + scatterSuffix)
              .selectAll("circle")
              .data(scatterData)
              .enter()
              .append("circle")
                .attr("class", d=> "circle dpoint-" + d.id)
                .attr("cx", d => scatterXscale(d.x))
                .attr("cy", d => scatterYscale(d.y))
                .attr("r", 2);

  }
}
