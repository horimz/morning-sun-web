import React, { Component } from 'react';
import Chart5 from './Chart5';

class ChartWrapper extends Component {
  state = { chart: null };

  componentDidMount() {
    const { data } = this.props;
    const keys = Object.keys(data);

    var formatedData = [];

    keys.forEach(key => {
      if (key === 'Charge rate')
        formatedData.push({ type: key, value: data[key] });
    });

    console.log(formatedData);

    this.setState({
      chart: new Chart5(
        this.refs.chart5,
        formatedData,
        window.innerWidth,
        window.innerHeight,
        'small'
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
      if (key === 'Charge rate')
        formatedData.push({ type: key, value: data[key] });
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
      if (key === 'Charge rate')
        formatedData.push({ type: key, value: data[key] });
    });

    chart.resize(
      this.refs.chart5,
      formatedData,
      window.innerWidth,
      window.innerHeight,
      'small'
    );
  };

  render() {
    return <div ref='chart5'></div>;
  }
}

export default ChartWrapper;
