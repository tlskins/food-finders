import axios from './api/axios'


class Config {
  constructor() {
    // this.API_HOST = 'http://food-finders-api.test/'
    this.API_HOST = 'http://food-finders-api.192.168.1.22.xip.io/'
  }

  setConfig( config ) {
    Object.assign( this, config )
    this.API_HOST = config.api_host
    axios.defaults.baseURL = this.API_HOST
  }

  set apiHost( host ) {
    this.API_HOST = host
  }

  get apiHost() {
    return this.API_HOST
  }
}


export default new Config()
