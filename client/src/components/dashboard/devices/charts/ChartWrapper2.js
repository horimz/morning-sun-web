import React, { Component } from 'react';
import Chart2 from './Chart2';

class ChartWrapper extends Component {
  componentDidMount() {
    this.setState({
      chart: new Chart2(
        this.refs.chart2,
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
      this.refs.chart2,
      this.props.data,
      window.innerWidth,
      window.innerHeight
    );
  };

  render() {
    return <div ref='chart2'></div>;
  }
}

export default ChartWrapper;
