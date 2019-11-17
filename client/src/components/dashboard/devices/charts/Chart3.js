import * as d3 from 'd3';
import _ from 'lodash';

var width = 800;
var height = 250;
var margin = { top: 50, right: 20, bottom: 20, left: 20 };
var graphWidth = width - margin.left - margin.right;
var graphHeight = height - margin.top - margin.bottom;

var parseTime = d3.timeParse('%Y-%m-%d');

class Chart3 {
  constructor(element, data, type, windowWidth, windowHeight) {
    this.type = type;
    this.data = data;
    // this.data.forEach(d => {
    //   d['_date'] = d.date;
    //   d.date = parseTime(d.date.split('T')[0]);
    // });

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
    this.x = d3.scaleTime().range([0, graphWidth]);
    this.y = d3.scaleLinear().range([graphHeight, 0]);

    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + graphHeight + ')');
    this.yAxisGroup = this.graph.append('g').attr('class', 'y-axis');

    // y-axis grid
    this.yGrid = this.graph.append('g').attr('class', 'y-axis-grid');

    // Set area
    this.area = d3
      .area()
      .x(d => this.x(new Date(d.date)))
      .y0(graphHeight)
      .y1(d => d[this.type]);

    this.areaPath = this.graph.append('path');

    this.update(this.data, this.type);
  }

  update(data, type) {
    this.data = data;
    this.type = type;

    // Set Axis
    this.x.domain(d3.extent(this.data, d => new Date(d.date)));
    this.y.domain([0, d3.max(this.data, d => d[this.type])]);

    // console.log(this.data);
    // console.log(this.type);

    // update path data
    this.areaPath
      .data([this.data])
      .attr('class', 'area')
      .attr('d', this.area);

    // Add circles for points
    this.circles = this.graph.selectAll('circle').data(this.data);

    // remove unwanted points
    this.circles.exit().remove();

    // update current points
    this.circles
      .attr('r', '2')
      .attr('cx', d => this.x(new Date(d.date)))
      .attr('cy', d => this.y(d[this.type]));

    // add new points
    this.circles
      .enter()
      .append('circle')
      .attr('r', '2')
      .attr('cx', d => this.x(new Date(d.date)))
      .attr('cy', d => this.y(d[this.type]))
      .attr('fill', d => 'steelblue');

    this.xAxis = d3
      .axisBottom(this.x)
      .ticks(4)
      .tickFormat(d3.timeFormat('%H:%M %p'));

    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(3)
      .tickSize(-graphWidth, 0, 0);

    this.xAxisGroup.call(this.xAxis);
    this.yAxisGroup.call(this.yAxis);
    this.yGrid.call(this.yAxis);

    // // Add rects for points
    // var rectWidth = graphWidth / this.data.length + 21;
    // this.rects = this.graph.selectAll('rect').data(this.data);
    // this.rects
    //   .enter()
    //   .append('rect')
    //   .attr('x', d => this.x(new Date(d.date)) - 40)
    //   .attr('y', d => 0)
    //   .attr('width', `${rectWidth}px`)
    //   .attr('height', d => `${graphHeight}px`)
    //   .attr('fill', d => 'steelblue')
    //   .attr('opacity', 0);

    this.graph
      .selectAll('rect')
      .on('mouseover', (d, i, n) => {})
      .on('mouseleave', (d, i, n) => {});

    // this.data.forEach(d => {
    //   d.date = d._date;
    // });
  }

  resize(element, data, windowWidth, windowHeight) {
    this.svg.remove();

    // this.update();
  }
}

export default Chart3;
