import * as d3 from 'd3';

var width = 460;
var height = 200;
var margin = { top: 50, right: 20, bottom: 20, left: 20 };
var graphWidth = width - margin.left - margin.right;
var graphHeight = height - margin.top - margin.bottom;

class Chart4 {
  constructor(element, data, windowWidth, windowHeight, size) {
    if (size === 'big') {
      width = windowWidth / 2 + 200;
      height = windowHeight / 2;

      graphWidth = width - margin.left - margin.right;
      graphHeight = height - margin.top - margin.bottom;
    }

    if (size === 'small') {
      width = windowWidth / 2 - 150;
      height = windowHeight / 3 - 50;

      if (windowWidth > 600 && windowWidth <= 1000) {
        width = 350;
      } else if (windowWidth > 0 && windowWidth <= 600) {
        width = 230;
      }

      graphWidth = width - margin.left - margin.right;
      graphHeight = height - margin.top - margin.bottom;
    }

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
      .padding(0.2);
    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + graphHeight + ')');

    this.y = d3.scaleLinear().range([graphHeight, 0]);
    this.yAxisGroup = this.graph.append('g').attr('class', 'y-axis');

    // y-axis grid
    this.yGrid = this.graph.append('g').attr('class', 'y-axis-grid');

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

    this.update(this.data);
  }

  update(data) {
    this.data = data;

    this.x.domain(this.data.map(d => d.type));
    this.y.domain([0, 5]);

    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(3)
      .tickSize(-graphWidth, 0, 0);

    this.xAxisGroup.call(this.xAxis);
    this.yAxisGroup.call(this.yAxis);
    this.yGrid.call(this.yAxis);

    this.rects = this.graph.selectAll('rect').data(this.data);

    // remove unwanted points
    this.rects.exit().remove();

    // update current points
    this.rects
      .attr('x', d => this.x(d.type))
      .attr('y', d => this.y(d.value))
      .attr('width', this.x.bandwidth())
      .attr('height', d => graphHeight - this.y(d.value))
      .attr('fill', d => this.setColor(d.value));

    // add new points
    this.rects
      .enter()
      .append('rect')
      .attr('x', d => this.x(d.type))
      .attr('y', d => this.y(d.value))
      .attr('width', this.x.bandwidth())
      .attr('height', d => graphHeight - this.y(d.value))
      .attr('fill', d => this.setColor(this.value))
      .attr('opacity', 0.7);

    this.graph
      .selectAll('rect')
      .on('mouseover', (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(100)
          .attr('fill', this.setColorOnHover(d.value))
          .attr('opacity', 1);

        this.text
          .raise()
          .attr('x', this.x(d.type) + this.x.bandwidth() / 2)
          .attr('y', this.y(d.value) - 10)
          .style('opacity', 1)
          .text(`${d.value}V`);

        this.yDottedLine
          .attr('x1', 0)
          .attr('x2', graphWidth)
          .attr('y1', this.y(d.value))
          .attr('y2', this.y(d.value));

        this.dottedLines.style('opacity', 1);
      })
      .on('mouseleave', (d, i, n) => {
        d3.select(n[i])
          .transition()
          .duration(100)
          .attr('fill', this.setColor(d.value))
          .attr('opacity', 0.7);

        this.text.style('opacity', 0);
        this.dottedLines.style('opacity', 0);
      });
  }

  setColor(value) {
    if (value < 3) {
      return '#e74c3c';
    } else if (value >= 3 && value <= 4.2) {
      return '#f1c40f';
    } else if (value > 4.2) {
      return '#e74c3c';
    }

    return '#487eb0';
  }

  setColorOnHover(value) {
    if (value < 3) {
      return '#c0392b';
    } else if (value >= 3 && value <= 4.2) {
      return '#e1b12c';
    } else if (value > 4.2) {
      return '#c0392b';
    }

    return '#40739e';
  }

  resize(element, data, windowWidth, windowHeight, size) {
    this.svg.remove();

    if (size === 'big') {
      width = windowWidth / 2 + 200;
      height = windowHeight / 2;

      graphWidth = width - margin.left - margin.right;
      graphHeight = height - margin.top - margin.bottom;
    }

    if (size === 'small') {
      width = windowWidth / 2 - 150;
      height = windowHeight / 3 - 50;

      if (windowWidth > 600 && windowWidth <= 1000) {
        width = 350;
      } else if (windowWidth > 0 && windowWidth <= 600) {
        width = 230;
      }

      graphWidth = width - margin.left - margin.right;
      graphHeight = height - margin.top - margin.bottom;
    }

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
      .padding(0.2);
    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + graphHeight + ')');

    this.y = d3.scaleLinear().range([graphHeight, 0]);
    this.yAxisGroup = this.graph.append('g').attr('class', 'y-axis');

    // y-axis grid
    this.yGrid = this.graph.append('g').attr('class', 'y-axis-grid');

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

    this.update(this.data);
  }
}

export default Chart4;
