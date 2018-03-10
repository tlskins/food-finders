import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Badge, Button, ButtonGroup } from 'react-bootstrap'


class Rating extends Component {
  constructor(props) {
    super(props)
    const { user, tags } = props

    if ( user && tags ) {
      const ratingComponents = this.calculateRatingComponents(user, tags)
      this.state = { ...ratingComponents }
    }
    else {
      this.state = {
        rater: undefined,
        ratee: undefined,
        rateable: undefined,
        ratingType: undefined,
        ratingMetrics: [],
      }
    }
  }

  componentWillReceiveProps = nextProps => {
    const { user, tags } = nextProps

    if ( user && tags ) {
      const ratingComponents = this.calculateRatingComponents(user, tags)
      this.setState({ ...ratingComponents })
    }
  }

  calculateRatingComponents = (user, tags) => {
    const allMetrics = tags.filter( t => t.taggableType === 'FoodRatingMetric' )
    const allValidMetrics = []
    allMetrics.forEach( m => {
      if ( allValidMetrics.length === 0 || allValidMetrics.every( v => v.handle !== m.handle ) ) {
        allValidMetrics.push(m)
      }
    })

    return {
      rater: user,
      ratee: tags.find( t => t.taggableType === 'Entity' ),
      rateable: tags.find( t => t.taggableType === 'Food' ),
      ratingType: tags.find( t => t.taggableType === 'FoodRatingType' ),
      ratingMetrics: allValidMetrics,
    }
  }

  renderBadge = component => {
    if ( Array.isArray(component) ) {
      if ( component.length < 1 ) {
        return null
      }
      else {
        return (
          <div className='rating-component-badges'>
            { component.map( m =>
              <div className='badge-container'>
                <Badge>
                  { m.symbol + m.handle }
                </Badge>
              </div>
            ) }
          </div>
        )
      }
    }
    else {
      if ( !component ) {
        return null
      }
      else {
        return (
          <div className='badge-container'>
            <Badge>
              { component.symbol + component.handle }
            </Badge>
          </div>
        )
      }
    }
  }

  render() {
    const {
      rater,
      ratee,
      rateable,
      ratingType,
      ratingMetrics,
    } = this.state

    if ( !ratingType || !rater ) {
      return null
    }

    return (
      <div>
        <ButtonGroup vertical>
          <Button bsStyle="warning">
            Rating
            <div className='rating-component-badges'>
              { this.renderBadge(ratingType) }
            </div>
          </Button>
          <Button bsStyle="warning">
            Food
            { this.renderBadge(rateable) }
          </Button>
          <Button bsStyle="warning">
            Entity
            { this.renderBadge(ratee) }
          </Button>
          <Button bsStyle="warning">
            Metrics
            { this.renderBadge(ratingMetrics) }
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

Rating.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
}

export default Rating
