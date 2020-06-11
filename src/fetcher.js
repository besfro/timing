/*
 * fetcher
 * This class is used to fetch server
 * dependncy fetch API
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

  async fetch () {
    const { url, fallback } = this.options
    const result = await this._whileFetch(url)
    if (result) {
      return result
    } else {
      let fallbackResult = await this._whileFetch(fallback)
      return fallbackResult ? fallbackResult : Promise.reject(false)
    }
  }

  async _whileFetch (url) {
    const { maxtry } = this.options
    const result = await (async function dowhile (count) {
      const fetchResult = await _fetch(url).catch(e => false)
      if (fetchResult) {    
        return fetchResult
      } else {
        return time++ < 10 ? dowhile(count) : false
      }
    })(maxtry)
    return result
  }

  _fetch (url) {
    return fetch(url, this.options)
  }
}

export default fetcher