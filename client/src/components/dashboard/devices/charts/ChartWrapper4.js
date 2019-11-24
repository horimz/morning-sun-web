import React, { Component } from 'react';
import Chart4 from './Chart4';

class ChartWrapper extends Component {
  state = { chart: null };

  componentDidMount() {
    const { data } = this.props;
    const keys = Object.keys(data);

    var formatedData = [];

    keys.forEach(key => {
      if (key !== 'Temperature' && key !== 'Charge rate') {
        formatedData.push({ type: key, value: data[key] });
      }
    });

    this.setState({
      chart: new Chart4(
        this.refs.chart4,
        formatedData,
        window.innerWidth,
        window.innerHeight,
        'big'
      )
    });

    window.addEventListener('resize', this.updateWindowDimensions);
  }

  shouldComponentUpdate() {
    return false;
  }

  static getDerivedStateFromProps(props, state) {
    const { chart } = state;
    const { data } = props;

    if (chart === null) return null;

    const keys = Object.keys(data);

    var formatedData = [];

    keys.forEach(key => {
      if (key !== 'Temperature' && key !== 'Charge rate') {
        formatedData.push({ type: key, value: data[key] });
      }
    });

    chart.update(formatedData);

    return null;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const { chart } = this.state;

    const { data } = this.props;
    const keys = Object.keys(data);

    var formatedData = [];

    keys.forEach(key => {
      if (key !== 'Temperature' && key !== 'Charge rate') {
        formatedData.push({ type: key, value: data[key] });
      }
    });

    chart.resize(
      this.refs.chart4,
      formatedData,
      window.innerWidth,
      window.innerHeight,
      'big'
    );
  };

  render() {
    return <div ref='chart4'></div>;
  }
}

export default ChartWrapper;
