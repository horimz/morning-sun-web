import React, { Component } from 'react';
import Chart1 from './Chart1';

class ChartWrapper extends Component {
  componentDidMount() {
    this.setState({
      chart: new Chart1(
        this.refs.chart1,
        this.props.data,
        window.innerWidth,
        window.innerHeight
      )
    });

    window.addEventListener('resize', this.updateWindowDimensions);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const { chart } = this.state;

    // resize the chart
    chart.resize(
      this.refs.chart1,
      this.props.data,
      window.innerWidth,
      window.innerHeight
    );
  };

  render() {
    return <div ref='chart1'></div>;
  }
}

export default ChartWrapper;
