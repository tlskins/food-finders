import { connect } from 'react-redux'

import EntitySelect from '@components/home/EntitySelect'

import services from '@services'
import coordinators from '@coordinators'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = () => {
  const { RestService } = services

  const createEntity = coordinators.createEntity({ RestService })
  const suggestYelp = coordinators.suggestYelp({ RestService })
  const searchEntitiesByBusinessId = coordinators.searchEntitiesByBusinessId({ RestService })

  return {
    createEntity,
    searchEntitiesByBusinessId,
    suggestYelp,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySelect)
