import React, { Component } from 'react';
import Chart3 from './Chart3';

class ChartWrapper extends Component {
  state = { chart: null };

  componentDidMount() {
    this.setState({
      chart: new Chart3(
        this.refs.chart3,
        this.props.data,
        this.props.type,
        window.innerWidth,
        window.innerHeight
      )
    });

    window.addEventListener('resize', this.updateWindowDimensions);
  }

  static getDerivedStateFromProps(props, state) {
    const { chart } = state;
    const { data, type } = props;

    if (chart === null) return null;

    chart.update(data, type);

    return null;
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
      this.refs.chart3,
      this.props.data,
      this.props.type,
      window.innerWidth,
      window.innerHeight
    );
  };

  render() {
    return <div ref='chart3'></div>;
  }
}

export default ChartWrapper;
