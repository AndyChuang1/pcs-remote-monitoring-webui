// Copyright (c) Microsoft. All rights reserved.

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Chart from './generateChart';
import { Row, Col } from 'react-bootstrap';
import LineChart from './lineChart';
import Lang from '../../common/lang';
import './kpiWidget.css';

class PieChartGraph extends PureComponent {
  componentWillUpdate(nextProps) {
    this.pieChart = {
      chartConfig: {
        size: {
          height: 150,
          width: 150
        },
        bindto: '#pieChart',
        data: {
          columns: nextProps.pieChartData,
          type: 'pie',
          unload: true
        },
        legend: {
          show: false
        },
        color: {
          pattern: [
            '#B3B3B3',
            '#7085FD',
            '#707070',
            '#4D4D4D',
            '#333333',
            '#98df8a'
          ]
        }
      },
      chartId: 'pieChart'
    };
  }
  render() {
    const pieChart = this.pieChart;
    return (
      <div>
        <Row className="pie-line-chart">
          <Col md={6} className="pie-chart">
            <div className="pie-header">
              {Lang.KPI.ALARMBYDEVICETYPE}
            </div>
            {this.props.pieChartData
              ? <Chart
                  chartConfig={pieChart.chartConfig}
                  chartId={pieChart.chartId}
                />
              : null}
          </Col>
          <Col>
            <LineChart />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  if (
    !state.deviceReducer ||
    !state.deviceReducer.devices ||
    !state.kpiReducer ||
    !state.kpiReducer.alarmsList
  ) {
    return {};
  }
  const devices = state.deviceReducer.devices.items;
  const alarms = state.kpiReducer.alarmsList;
  const deviceIdVsAlarmCount = {};
  const deviceIdVsDeviceName = {};
  devices.forEach(device => {
    if (
      !deviceIdVsDeviceName[device.Id] &&
      device.Twin &&
      device.Twin.reportedProperties &&
      device.Twin.reportedProperties.Type
    ) {
      deviceIdVsDeviceName[device.Id] = device.Twin.reportedProperties.Type;
    }
  });
  alarms.forEach(device => {
    if (!device.DeviceId) {
      return;
    }
    if (!deviceIdVsAlarmCount[device.DeviceId]) {
      deviceIdVsAlarmCount[device.DeviceId] = 0;
    }
    deviceIdVsAlarmCount[device.DeviceId] += 1;
  });
  const pieChartData = [];
  Object.keys(deviceIdVsDeviceName).forEach(deviceId => {
    const deviceName = deviceIdVsDeviceName[deviceId];
    const count = deviceIdVsAlarmCount[deviceId] || 0;
    if (count > 0) {
      pieChartData.push([deviceName, count]);
    }
  });
  let otherDevicesCount = 0;
  Object.keys(deviceIdVsAlarmCount).forEach(deviceId => {
    if (!deviceIdVsDeviceName[deviceId]) {
      otherDevicesCount += deviceIdVsAlarmCount[deviceId] || 0;
    }
  });
  if (otherDevicesCount > 0) {
    pieChartData.push(['Other', otherDevicesCount]);
  }
  return {
    pieChartData: pieChartData
  };
};

export default connect(mapStateToProps, null)(PieChartGraph);
