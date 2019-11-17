import * as d3 from 'd3';
import _ from 'lodash';

var width = 650;
var height = 200;
var margin = { top: 50, right: 20, bottom: 20, left: 20 };
var graphWidth = width - margin.left - margin.right;
var graphHeight = height - margin.top - margin.bottom;

var parseTime = d3.timeParse('%Y-%m-%d');

class Chart1 {
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

    // Format data to only display five elements
    this.data = _.takeRight(data, 5);
    this.data.forEach(d => {
      d['_date'] = d.date;
      d.date = parseTime(d.date.split('T')[0]);
    });

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
      .scaleTime()
      .range([0, graphWidth])
      .domain(d3.extent(this.data, d => new Date(d.date)))
      .nice(d3.timeDay);
    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + graphHeight + ')');
    this.xAxis = d3
      .axisBottom(this.x)
      .ticks(4)
      .tickFormat(d3.timeFormat('%d %b'));
    this.xAxisGroup.call(this.xAxis);

    this.y = d3
      .scaleLinear()
      .range([graphHeight, 0])
      .domain([0, d3.max(this.data, d => d.value)]);
    this.yAxisGroup = this.graph.append('g').attr('class', 'y-axis');
    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(3)
      .tickSize(-graphWidth, 0, 0);
    this.yAxisGroup.call(this.yAxis);

    // y-axis grid
    this.yGrid = this.graph.append('g').attr('class', 'y-axis-grid');
    this.yGrid.call(this.yAxis);

    // Tooltips to show on mouse events (text, dotted lines)
    this.text1 = this.graph
      .append('text')
      .attr('class', 'chart-tip-text1')
      .attr('text-anchor', 'left')
      .style('opacity', 0);
    this.text2 = this.graph
      .append('text')
      .attr('class', 'chart-tip-text2')
      .attr('text-anchor', 'left')
      .style('opacity', 0);

    this.dottedLines = this.graph
      .append('g')
      .attr('class', 'dotted-lines')
      .style('opacity', 1);
    this.xDottedLine = this.dottedLines.append('line');

    if (this.data.length === 1) {
      this.text1
        .attr('x', this.calcX(this.x(new Date(this.data[0].date))))
        .attr('y', graphHeight / 2)
        .style('opacity', 1)
        .text(`${this.data[0]._date}`);

      this.text2
        .raise()
        .attr('x', this.calcX(this.x(new Date(this.data[0].date))))
        .attr('y', graphHeight / 2 + 20)
        .style('opacity', 1)
        .text(`Published ${this.data[0].value}`);

      this.xDottedLine
        .attr('x1', graphWidth / 2)
        .attr('x2', graphWidth / 2)
        .attr('y1', graphHeight)
        .attr('y2', this.y(this.data[0].value));

      this.dottedLines.style('opacity', 1);
    }

    this.update();
  }

  update() {
    // Add lines
    this.graph
      .append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x(d => this.x(new Date(d.date)))
          .y(d => this.y(d.value))
      );

    // Add circles for points
    this.circles = this.graph.selectAll('circle').data(this.data);
    this.circles
      .enter()
      .append('circle')
      .attr('r', '1')
      .attr('cx', d => this.x(new Date(d.date)))
      .attr('cy', d => this.y(d.value))
      .attr('fill', d => 'steelblue');

    // Add rects for points
    // var [start, end] = d3.extent(this.data, d => new Date(d.date));
    // const diffTime = Math.abs(new Date(end) - new Date(start));
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    var rectWidth = graphWidth;
    this.rects = this.graph.selectAll('rect').data(this.data);
    this.rects
      .enter()
      .append('rect')
      .attr('x', d => this.x(new Date(d.date)))
      .attr('y', d => 0)
      .attr('width', `${rectWidth}px`)
      .attr('height', d => `${graphHeight}px`)
      .attr('fill', d => 'steelblue')
      .attr('opacity', 0);

    this.graph
      .selectAll('rect')
      .on('mouseover', (d, i, n) => {
        this.text1
          .raise()
          .attr('x', this.calcX(this.x(new Date(d.date))))
          .attr('y', graphHeight / 2)
          .style('opacity', 1)
          .text(`${d._date}`);

        this.text2
          .raise()
          .attr('x', this.calcX(this.x(new Date(d.date))))
          .attr('y', graphHeight / 2 + 20)
          .style('opacity', 1)
          .text(`Published ${d.value}`);

        this.xDottedLine
          .attr('x1', this.x(new Date(d.date)))
          .attr('x2', this.x(new Date(d.date)))
          .attr('y1', graphHeight)
          // .attr('y2', 0);
          .attr('y2', this.y(d.value));

        this.dottedLines.style('opacity', 1);
      })
      .on('mouseleave', (d, i, n) => {
        if (this.data.length > 1) {
          this.text1.style('opacity', 0);
          this.text2.style('opacity', 0);
          this.dottedLines.style('opacity', 0);
        }
      });
  }

  calcX(xPos) {
    let pos = xPos + 10;
    if (xPos > 300) pos -= 100;
    return pos;
  }

  resize(element, data, windowWidth, windowHeight) {
    this.svg.remove();

    this.data.forEach(d => {
      d.date = d._date;
    });

    width = windowWidth / 2 - 150;
    height = windowHeight / 3 - 50;

    if (windowWidth > 600 && windowWidth <= 1000) {
      width = 350;
    } else if (windowWidth > 0 && windowWidth <= 600) {
      width = 230;
    }

    graphWidth = width - margin.left - margin.right;
    graphHeight = height - margin.top - margin.bottom;

    // Format data to only display five elements
    this.data = _.takeRight(data, 5);
    this.data.forEach(d => {
      d['_date'] = d.date;
      d.date = parseTime(d.date.split('T')[0]);
    });

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
      .scaleTime()
      .range([0, graphWidth])
      .domain(d3.extent(this.data, d => new Date(d.date)))
      .nice(d3.timeDay);
    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + graphHeight + ')');
    this.xAxis = d3
      .axisBottom(this.x)
      .ticks(4)
      .tickFormat(d3.timeFormat('%d %b'));
    this.xAxisGroup.call(this.xAxis);

    this.y = d3
      .scaleLinear()
      .range([graphHeight, 0])
      .domain([0, d3.max(this.data, d => d.value)]);
    this.yAxisGroup = this.graph.append('g').attr('class', 'y-axis');
    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(3)
      .tickSize(-graphWidth, 0, 0);
    this.yAxisGroup.call(this.yAxis);

    // y-axis grid
    this.yGrid = this.graph.append('g').attr('class', 'y-axis-grid');
    this.yGrid.call(this.yAxis);

    // Tooltips to show on mouse events (text, dotted lines)
    this.text1 = this.graph
      .append('text')
      .attr('class', 'chart-tip-text1')
      .attr('text-anchor', 'left')
      .style('opacity', 0);
    this.text2 = this.graph
      .append('text')
      .attr('class', 'chart-tip-text2')
      .attr('text-anchor', 'left')
      .style('opacity', 0);

    this.dottedLines = this.graph
      .append('g')
      .attr('class', 'dotted-lines')
      .style('opacity', 0);
    this.xDottedLine = this.dottedLines.append('line');

    this.update();
  }
}

export default Chart1;
