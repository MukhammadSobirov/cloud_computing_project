const DATA_URL = document.getElementById("income_data").innerHTML;

const svg = d3.select("#bar-chart-income");
const svg_exp = d3.select("#bar-chart-expense");
const svg_line_exp = d3.select("#line-chart-expense");
const svg_line_inc = d3.select('#line-chart-inc')

const income_div = d3.select(".text-data");
const expense_div = d3.select(".text-data-exp");
const expense_line_div = d3.select(".text-data-line-exp");

const width = +svg.attr("width");
const height = +svg.attr("height");

//values that we can access later on
const xValue = (d) => d.value;
const yValue = (d) => d.category;
const margin = { top: 50, right: 90, bottom: 50, left: 90 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

//rendering incomes_________________________________________________________________
function render(data) {
  //x scale
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  //y scale
  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  //making a group element
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //defining axis
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.format(".2s"))
    .tickSize(-innerHeight);

  g.append("g").call(yAxis).selectAll(".domain, .tick line").remove();

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(${0}, ${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "xAxis-title")
    .attr("y", 30)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text("Amount");

  //selecting element
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", (d) => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "#003f5c");

  g.append("text")
    .attr("class", "bar-chart-title")
    .attr("y", -10)
    .text("Income per Category");

  let totalIncome = [];
  data.forEach((d) => {
    totalIncome.push(d.value);
  });

  const total_income = totalIncome.reduce((a, b) => a + b);

  income_div
    .selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .text((d) => {
      const dCategory = d.category + ": ";
      const evaluated = Math.round((d.value / total_income) * 100);
      return dCategory + evaluated + "%";
    })
    .attr("class", "text-data-text");
}

//rendering income line chart
function render_inc_line(data) {
  const title = "Income over the whole period of time";

  const xValue = (d) => d.date;
  const xAxisLabel = "Time";

  const yValue = (d) => d.value;
  const circleRadius = 6;
  const yAxisLabel = "Value";

  const margin = { top: 40, right: 0, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const g = svg_line_inc
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);

  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

  const yAxisG = g.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();



  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    .curve(d3.curveBasis);

  g.append("path").attr("class", "line-path-inc").attr("d", lineGenerator(data));

  g.append("text").attr("class", "title").attr("y", -10).text(title);
}

function render_exp(data) {
  const width = +svg_line_exp.attr("width");
  const height = +svg_line_exp.attr("height");

  //x scale
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  //y scale
  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  //making a group element
  const g = svg_exp
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //defining axis
  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.format(".2s"))
    .tickSize(-innerHeight);

  g.append("g").call(yAxis).selectAll(".domain, .tick line").remove();

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(${0}, ${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "xAxis-title")
    .attr("y", 30)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text("Amount");

  //selecting element
  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", (d) => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "#ff6361");

  g.append("text")
    .attr("class", "bar-chart-title")
    .attr("y", -10)
    .text("Expense per Category");

  let totalExpense = [];
  data.forEach((d) => {
    totalExpense.push(d.value);
  });

  const total_expense = totalExpense.reduce((a, b) => a + b);

  expense_div
    .selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .text((d) => {
      const dCategory = d.category + ": ";
      const evaluated = Math.round((d.value / total_expense) * 100);
      return dCategory + evaluated + "%";
    })
    .attr("class", "text-data-text");
}

//expense line chart _______________________________________________________________________
function render_exp_line(data) {
  const title = "Expense over the whole period of time";

  const xValue = (d) => d.date;
  const xAxisLabel = "Time";

  const yValue = (d) => d.value;
  const circleRadius = 6;
  const yAxisLabel = "Value";

  const margin = { top: 40, right: 0, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const g = svg_line_exp
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);

  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

  const yAxisG = g.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();



  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    .curve(d3.curveBasis);

  g.append("path").attr("class", "line-path").attr("d", lineGenerator(data));

  g.append("text").attr("class", "title").attr("y", -10).text(title);
}

//incomes data fetching ==================================================================================
d3.json(`${DATA_URL}/income_date`).then((data) => {
  data = data.income_date;
  data.forEach((d) => {
    d.date = new Date(d.date);
  });
  render_inc_line(data);
  console.log(data);
});

d3.json(`${DATA_URL}/incomes`).then((data) => {
  data = data.income_category;
  render(data);
  console.log(data);
});

//expenses data fetching ==================================================================================
d3.json(`${DATA_URL}/expenses`).then((data) => {
  data = data.expense_category;
  render_exp(data);
  console.log(data);
});


d3.json(`${DATA_URL}/expense_date`).then((data) => {
  data = data.expense_date;
  data.forEach((d) => {
    d.date = new Date(d.date);
  });
  render_exp_line(data);
  console.log(data);
});
