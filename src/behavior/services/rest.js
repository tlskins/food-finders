import { default as BaseService } from './base'
import Api from '@api'

export class RestService extends BaseService {
  async get( uri, params = {}, headers = {}) {
    return await Api.get( uri, params, headers )
  }

  async post( uri, data = {}, headers = {}) {
    return await Api.post( uri, data, headers )
  }

  async put( uri, data = {}, headers = {}) {
    return await Api.put( uri, data, headers )
  }

  async delete( uri, data = {}, headers = {}) {
    return await Api.delete( uri, data, headers )
  }
}
