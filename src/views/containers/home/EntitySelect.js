import { connect } from 'react-redux'

import EntitySelect from '@components/home/EntitySelect'

import services from '@services'
import coordinators from '@coordinators'

const mapStateToProps = state => {
  return {
    // count: state.counter.count,
    // isIncrementing: state.counter.isIncrementing,
    // isDecrementing: state.counter.isDecrementing,
  }
}

const mapDispatchToProps = () => {
  const { RestService } = services

  const suggestYelp = coordinators.suggestYelp({ RestService })

  return {
    suggestYelp,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySelect)
