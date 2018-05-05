import React, { Component } from 'react'


class SocialEntryLegend extends Component {
  render() {
    return (
      <div className="social-entry-legend">
        Tag Legend
        <div className="legend-row">
          <div className="social-entry-tag__entity">@ Entity / User</div>
          <div className="social-entry-tag__food">^ Food</div>
          <div className="social-entry-tag__foodratingtype"># Rating Type</div>
          <div className="social-entry-tag__foodratingmetric">& Rating Metric</div>
        </div>
        <div className="legend-row">
          Ratings must have at least one of each tag
        </div>
      </div>
    )
  }
}


export default SocialEntryLegend
