import * as d3 from 'd3';

var width = 460;
var height = 200;
var margin = { top: 50, right: 20, bottom: 20, left: 20 };
var graphWidth = width - margin.left - margin.right;
var graphHeight = height - margin.top - margin.bottom;

class Chart2 {
  constructor(element, data, windowWidth, windowHeight) {
    width = windowWidth / 2 - 150;
    height = windowHeight / 3 - 50;

    if (windowWidth > 600 && windowWidth <= 1000) {
      width = 350;
    } else if (windowWidth > 0 && windowWidth <= 600) {
      width = 230;
    }

    graphWidth = width - margin.left - margin.right;
    graphHeight = height - margin.top - margin.bottom;

    this.data = data;

    // Add svg element to DOM
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('class', 'chart-1')
      .attr('width', width)
      .attr('height', height);
    this.graph = this.svg
      .append('g')
      .attr('class', 'chart-1-group')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Add axis
    this.x = d3
      .scaleBand()
      .range([0, graphWidth])
      .domain(this.data.map(d => d.level))
      .padding(0.2);
    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + graphHeight + ')');
    this.xAxis = d3.axisBottom(this.x);
    this.xAxisGroup.call(this.xAxis);

    this.y = d3
      .scaleLinear()
      .range([graphHeight, 0])
      .domain([0, d3.max(this.data, d => d.numOfLogs)]);
    this.yAxisGroup = this.graph.append('g').attr('class', 'y-axis');
    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(3)
      .tickSize(-graphWidth, 0, 0);
    this.yAxisGroup.call(this.yAxis);

    // y-axis grid
    this.yGrid = this.graph.append('g').attr('class', 'y-axis-grid');
    this.yGrid.call(this.yAxis);

    // Tooltips to show on mouse events
    this.text = this.graph
      .append('text')
      .attr('class', 'bar-chart-tip-text')
      .attr('text-anchor', 'middle')
      .style('opacity', 0);

    this.dottedLines = this.graph
      .append('g')
      .attr('class', 'lines')
      .style('opacity', 0);
    this.yDottedLine = this.dottedLines.append('line');

    this.update();
  }

  update() {
    this.graph
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', d => this.x(d.level))
      .attr('y', d => this.y(d.numOfLogs))
      .attr('width', this.x.bandwidth())
      .attr('height', d => graphHeight - this.y(d.numOfLogs))
      .attr('fill', d => this.setColor(d.level))
      .attr('opacity', 0.7);

    this.graph
      .selectAll('rect')
      .on('mouseover', (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(100)
          .attr('fill', this.setColorOnHover(d.level))
          .attr('opacity', 1);

        this.text
          .raise()
          .attr('x', this.x(d.level) + this.x.bandwidth() / 2)
          .attr('y', this.y(d.numOfLogs) - 10)
          .style('opacity', 1)
          .text(`${d.numOfLogs}`);

        this.yDottedLine
          .attr('x1', 0)
          .attr('x2', graphWidth)
          .attr('y1', this.y(d.numOfLogs))
          .attr('y2', this.y(d.numOfLogs));

        this.dottedLines.style('opacity', 1);
      })
      .on('mouseleave', (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(100)
          .attr('fill', this.setColor(d.level))
          .attr('opacity', 0.7);

        this.text.style('opacity', 0);
        this.dottedLines.style('opacity', 0);
      });
  }

  setColor(level) {
    switch (level) {
      case 'critical':
        return '#e74c3c';
      case 'error':
        return '#e67e22';
      case 'warning':
        return '#f1c40f';
      case 'info':
        return '#3498db';
      default:
        return '#487eb0';
    }
  }

  setColorOnHover(level) {
    switch (level) {
      case 'critical':
        return '#c0392b';
      case 'error':
        return '#d35400';
      case 'warning':
        return '#e1b12c';
      case 'info':
        return '#2980b9';
      default:
        return '#40739e';
    }
  }

  resize(element, data, windowWidth, windowHeight) {
    this.svg.remove();

    width = windowWidth / 2 - 150;
    height = windowHeight / 3 - 50;

    if (windowWidth > 600 && windowWidth <= 1000) {
      width = 350;
    } else if (windowWidth > 0 && windowWidth <= 600) {
      width = 230;
    }

    graphWidth = width - margin.left - margin.right;
    graphHeight = height - margin.top - margin.bottom;

    this.data = data;

    // Add svg element to DOM
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('class', 'chart-1')
      .attr('width', width)
      .attr('height', height);
    this.graph = this.svg
      .append('g')
      .attr('class', 'chart-1-group')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Add axis
    this.x = d3
      .scaleBand()
      .range([0, graphWidth])
      .domain(this.data.map(d => d.level))
      .padding(0.2);
    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + graphHeight + ')');
    this.xAxis = d3.axisBottom(this.x);
    this.xAxisGroup.call(this.xAxis);

    this.y = d3
      .scaleLinear()
      .range([graphHeight, 0])
      .domain([0, d3.max(this.data, d => d.numOfLogs)]);
    this.yAxisGroup = this.graph.append('g').attr('class', 'y-axis');
    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(3)
      .tickSize(-graphWidth, 0, 0);
    this.yAxisGroup.call(this.yAxis);

    // y-axis grid
    this.yGrid = this.graph.append('g').attr('class', 'y-axis-grid');
    this.yGrid.call(this.yAxis);

    // Tooltips to show on mouse events
    this.text = this.graph
      .append('text')
      .attr('class', 'bar-chart-tip-text')
      .attr('text-anchor', 'middle')
      .style('opacity', 0);

    this.dottedLines = this.graph
      .append('g')
      .attr('class', 'lines')
      .style('opacity', 0);
    this.yDottedLine = this.dottedLines.append('line');

    this.update();
  }
}

export default Chart2;
