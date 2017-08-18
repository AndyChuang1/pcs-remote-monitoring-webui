// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Filter from '../../assets/icons/Filter.svg';
import * as actionTypes from '../../actions/actionTypes';
import Lang from '../../common/lang';
import ManageFilters from '../../assets/icons/ManageFilters.svg';
import {
  getRegionByDisplayName,
  loadRegionSpecificDevices
} from '../../actions/filterActions';
import './TopNavFilter.css';
import Select from 'react-select';

class TopNavFilter extends Component {
  constructor() {
    super();
    this.state = {
      selectedGroupId: 17
    };
  }
  componentDidMount() {
    this.props.loadRegions();
  }

  updateValue(newValue) {
    this.setState({
      selectedGroupId: newValue
    });
    this.props.deviceGroupChanged(newValue, this.props.deviceGroups);
  }

  render() {
    const deviceGroups = this.props.deviceGroups || [];
    let options = deviceGroups.map((group, idx) => {
      return {
        value: group.id,
        label: group.displayName
      };
    });
    return (
      <div className="fliter-wrapper">
        <img className="filter" src={Filter} alt="Filter" />
        <span>
          <Select
            className="top-nav-filters"
            autofocus
            options={options}
            value={this.state.selectedGroupId}
            onChange={this.updateValue.bind(this)}
            simpleValue
            searchable={true}
          />
        </span>
        <span
          onClick={this.props.showManageFiltersFlyout.bind(
            this,
            this.props.deviceGroups
          )}
          className="manage-filter-header"
        >
          <img
            className="manage-filters-icon"
            src={ManageFilters}
            alt="ManageFilters"
            height="12px"
          />
          {Lang.FILTER.MANAGEFILTER}
        </span>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadRegions: () => {
    dispatch(getRegionByDisplayName());
  },

  deviceGroupChanged: (selectedGroupId, deviceGroups) => {
    let selectedGroupConditions;
    deviceGroups.some(group => {
      if (group.id === selectedGroupId) {
        selectedGroupConditions = group.conditions;
        return true;
      }
      return false;
    });
    dispatch(loadRegionSpecificDevices(selectedGroupConditions));
  },
  showManageFiltersFlyout: deviceGroups => {
    dispatch({
      type: actionTypes.FLYOUT_SHOW,
      content: {
        type: 'Manage Filters',
        deviceGroups
      }
    });
  }
});

const mapStateToProps = state => ({
  deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavFilter);
