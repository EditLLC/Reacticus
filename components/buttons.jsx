/** @jsx React.DOM */

import _ from 'lodash';
import postal from 'postal';
import React from 'react';
import {SubscriptionMixin} from './channels';

export var ToggleMixin = {
  getInitialState: function() {
    return {active: this.props.default || false}
  },
  getComputedProps: function(moreProps) {
    return _.merge({"data-active": this.state.active ? 1 : 0}, this.props, moreProps)
  }
};

export var ToggleButton = React.createClass({
  /* A button with a data-toggle that toggles from 1 to 0 everytime it is clicked */
  mixins: [ToggleMixin],
  onClick: function(event) {
    this.setState({active: !this.state.active})
    if (this.props.onClick) {
      return this.props.onClick(event)
    }
  },
  render: function() {
    return <button {...this.getComputedProps({onClick: this.onClick, style: {display: 'inline'}})}>{this.props.children}</button>
  }
});

export var SectionToggleButton = React.createClass({
  /* A button with a data-toggle that tied to props.section */
  mixins: [ToggleMixin, SubscriptionMixin],
  propTypes: {
    section: React.PropTypes.string.isRequired
  },
  getDefaultProps: function() {
    //reactjs broke this?
    return {'id': _.uniqueId()}
  },
  componentWillMount: function() {
    var self = this;
    this.subscribe("reacticus.SectionToggleButton", this.props.section, function(data, envelope) {
      self.setState({active: (data.activeType === self.props.id)})
    });
  },
  onClick: function(event) {
    if (this.state.active) {
      event.preventDefault()
      return
    }
    postal.publish({
      channel: "reacticus.SectionToggleButton",
      topic: this.props.section,
      data: {activeType: this.props.id}
    });
    if (this.props.onClick) {
      return this.props.onClick(event)
    }
  },
  render: function() {
    return <div {...this.getComputedProps({onClick: this.onClick})}>{this.props.children}</div>
  }
});