import * as d3 from 'd3';

var width = 1000;
var height = 400;
var margin = { top: 50, right: 50, bottom: 20, left: 20 };
var graphWidth = width - margin.left - margin.right;
var graphHeight = height - margin.top - margin.bottom;

class Chart3 {
  constructor(element, data, type, windowWidth, windowHeight) {
    width = windowWidth / 2 + 200;
    height = windowHeight / 2;

    // if (windowWidth > 600 && windowWidth <= 1000) {
    //   width = 350;
    // } else if (windowWidth > 0 && windowWidth <= 600) {
    //   width = 230;
    // }

    graphWidth = width - margin.left - margin.right;
    graphHeight = height - margin.top - margin.bottom;

    this.type = type;
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

    this.line = d3
      .line()
      .x(d => this.x(new Date(d.date)))
      .y(d => this.y(d[this.type]));
    this.path = this.graph.append('path');

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

    this.update(this.data, this.type);
  }

  update(data, type) {
    this.data = data;
    this.type = type;

    this.text1.style('opacity', 0);
    this.text2.style('opacity', 0);
    this.dottedLines.style('opacity', 0);

    // Set Axis
    this.x.domain(d3.extent(this.data, d => new Date(d.date)));
    this.y.domain([0, d3.max(this.data, d => d[this.type])]);

    this.path
      .data([this.data])
      .attr('class', 'path-line')
      .style('stroke', this.setColor(this.type))
      .attr('d', this.line);

    // Add rects for points
    // var [start, end] = d3.extent(this.data, d => new Date(d.date));
    // const diffTime = Math.abs(new Date(end) - new Date(start));
    // const diffDays = Math.ceil(diffTime / (1000 * 24));

    var rectWidth = graphWidth;
    this.rects = this.graph.selectAll('rect').data(this.data);
    // Add circles for points
    this.circles = this.graph.selectAll('circle').data(this.data);

    // remove unwanted points
    this.circles.exit().remove();
    this.rects.exit().remove();

    // update current points
    this.circles
      .attr('r', '1')
      .attr('cx', d => this.x(new Date(d.date)))
      .attr('cy', d => this.y(d[this.type]))
      .attr('fill', d => this.setColor(this.type));

    this.rects
      .attr('x', d => this.x(new Date(d.date)))
      .attr('y', d => 0)
      .attr('width', `${rectWidth}px`)
      .attr('height', d => `${graphHeight}px`)
      .attr('fill', d => this.setColor(this.type));

    // add new points
    this.circles
      .enter()
      .append('circle')
      .attr('r', '1')
      .attr('cx', d => this.x(new Date(d.date)))
      .attr('cy', d => this.y(d[this.type]))
      .attr('fill', d => this.setColor(this.type));
    this.rects
      .enter()
      .append('rect')
      .attr('x', d => this.x(new Date(d.date)))
      .attr('y', d => 0)
      .attr('width', `${rectWidth}px`)
      .attr('height', d => `${graphHeight}px`)
      .attr('fill', d => this.setColor(this.type))
      .attr('opacity', 0);

    this.xAxis = d3
      .axisBottom(this.x)
      .ticks(5)
      .tickFormat(d3.timeFormat('%H:%M:%S'));

    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(4)
      .tickSize(-graphWidth, 0, 0)
      .tickFormat(d => d + this.getUnit(this.type));

    this.xAxisGroup.call(this.xAxis);
    this.yAxisGroup.call(this.yAxis);
    this.yGrid.call(this.yAxis);

    this.graph
      .selectAll('rect')
      .on('mouseover', (d, i, n) => {
        this.text1
          .raise()
          .attr('x', this.calcX(this.x(new Date(d.date))))
          .attr('y', -30)
          .style('opacity', 1)
          .text(`${d.date.split(' ')[4]}`);

        this.text2
          .raise()
          .attr('x', this.calcX(this.x(new Date(d.date))))
          .attr('y', -10)
          .style('opacity', 1)
          .text(this.getText(d, this.type));

        this.xDottedLine
          .attr('x1', this.x(new Date(d.date)))
          .attr('x2', this.x(new Date(d.date)))
          .attr('y1', graphHeight)
          // .attr('y2', 0);
          .attr('y2', this.y(d[this.type]));

        this.dottedLines.style('opacity', 1);
      })
      .on('mouseleave', (d, i, n) => {
        this.text1.style('opacity', 0);
        this.text2.style('opacity', 0);
        this.dottedLines.style('opacity', 0);
      });
  }

  getText(data, type) {
    switch (type) {
      case 'power':
        return `Value: ${data[type]}W`;
      case 'voltage':
        return `Value: ${data[type]}V`;
      case 'current':
        return `Value: ${data[type]}A`;
      default:
        return `Value: ${data[type]}`;
    }
  }

  getUnit(type) {
    switch (type) {
      case 'power':
        return 'W';
      case 'voltage':
        return 'V';
      case 'current':
        return 'A';
      default:
        return '';
    }
  }

  setColor(type) {
    switch (type) {
      case 'power':
        return 'steelblue';
      case 'voltage':
        return '#e1b12c';
      case 'current':
        return '#1abc9c';
      default:
        return 'steelblue';
    }
  }

  calcX(xPos) {
    let pos = xPos + 10;
    if (xPos > 600) pos -= 100;
    return pos;
  }

  resize(element, data, type, windowWidth, windowHeight) {
    this.svg.remove();

    width = windowWidth / 2 + 200;
    height = windowHeight / 2;

    // if (windowWidth > 850 && windowWidth <= 1150) {
    //   width = 350;
    // } else if (windowWidth > 0 && windowWidth <= 600) {
    //   width = 230;
    // }
    // console.log(windowWidth, windowHeight);
    // console.log(width, height);

    graphWidth = width - margin.left - margin.right;
    graphHeight = height - margin.top - margin.bottom;

    this.type = type;
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

    this.line = d3
      .line()
      .x(d => this.x(new Date(d.date)))
      .y(d => this.y(d[this.type]));
    this.path = this.graph.append('path');

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

    this.update(this.data, this.type);
  }
}

export default Chart3;
