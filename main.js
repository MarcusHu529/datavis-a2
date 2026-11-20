// Waiting until document has loaded
window.onload = () => {

  // YOUR CODE GOES HERE
  console.log("YOUR CODE GOES HERE");

  // Load the data set from the assets folder:
  d3.csv("cars.csv").then(data => {

    // Convert the data to numbers
    data.forEach(car => {
      car["Retail Price"]= Number(car["Retail Price"]);
      car["Dealer Cost"]= Number(car["Dealer Cost"]);
      car["Horsepower(HP)"]= Number(car["Horsepower(HP)"]);
    });

    // Create the SVG element to hold the scatter plot
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", 900)
                  .attr("height", 500);

    const margin = { top: 30, right: 30, bottom: 60, left: 70 };
    const plotWidth = 700 - margin.left - margin.right;
    const plotHeight = 500 - margin.top - margin.bottom;

    // Create a plotting group to hold the scatter plot points
    const plot = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Find the minimum and maximum values for Retail Price
    const min_retail_price = d3.min(data, d => d["Retail Price"]);
    const max_retail_price = d3.max(data, d => d["Retail Price"]);

    // Create a scaler for the Retail Price values to fit within the width of the SVG in the X direction
    const xScale = d3.scaleLinear()
                     .domain([min_retail_price, max_retail_price])
                     .range([0, plotWidth]);

    // Find the minimum and maximum values for Horsepower(HP)
    const min_horsepower = d3.min(data, d => d["Horsepower(HP)"]);
    const max_horsepower = d3.max(data, d => d["Horsepower(HP)"]);

    // Create a scaler for the Horsepower(HP) values to fit within the height of the SVG in the Y direction
    const yScale = d3.scaleLinear()
                     .domain([min_horsepower, max_horsepower])
                     .range([plotHeight, 0]);

    // Plot X and Y axis
    plot.append("g").attr("transform", `translate(0, ${plotHeight})`)
        .call(d3.axisBottom(xScale));
    plot.append("g").call(d3.axisLeft(yScale));

    // Plot X-axis label
    plot.append("text").text("Retail Price (€)")
        .attr("x", plotWidth / 2)
        .attr("y", plotHeight + 45)
        .attr("text-anchor", "middle");

    // Plot Y-axis label
    plot.append("text")
        .text("Horsepower(HP)")
        .attr("x", -plotHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)");

    const sizeScale = d3.scaleSqrt()
                        .domain([
                            d3.min(data, d => d["Dealer Cost"]),
                            d3.max(data, d => d["Dealer Cost"])
                        ])
                        .range([3, 12]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const details = d3.select("body")
                      .append("div")
                      .attr("id", "car-details");

    plot.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d["Retail Price"]))
        .attr("cy", d => yScale(d["Horsepower(HP)"]))
        .attr("r", d => sizeScale(d["Dealer Cost"]))
        .attr("fill", d => colorScale(d["Type"]))
        .on("click", function(d) {
          details.html(`
            <h3>${d["Name"]}</h3>
            <p>Retail Price: ${d["Retail Price"]}</p>
            <p>Hoursepower(HP): ${d["Horsepower(HP)"]}</p>
            <p>Dealer Cost: ${d["Dealer Cost"]}</p>
            <p>Type: ${d["Type"]}</p>
          `);
        });

    const types = Array.from(new Set(data.map(d => d["Type"])));


    const legend = svg.append("g")
      .attr("transform", "translate(720, 50)");

    const legendItems = legend.selectAll("g")
        .data(types)
        .enter()
        .append("g");

    legendItems.append("circle")
    .attr("cx", 0)
    .attr("cy", (d, i) => i * 25)
    .attr("r", 6)
    .attr("fill", d => colorScale(d));

    legendItems.append("text")
        .attr("x", 15)
        .attr("y", (d, i) => i * 25)
        .attr("dy", "0.35em")
        .text(d => d);



  });
};
