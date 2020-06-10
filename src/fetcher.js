/*
 * fetch time server
 * This class is used to get precise time from timeServer
 */   

// default options
import config from './config'

class fetcher {
  
  constructor (options = {}) {
    this.options = Object.assign({}, config.timeServer, options)
    this.checked()
  }

  checked () {
    if (window.fetch) {
      console.warn(`Browser unsupports fetch API (See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).`)
    }
  }

  fetch () {

  }

  _fetch (url, config = {}) {
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
    return fetch(url, config)
  }
}

export default fetcher