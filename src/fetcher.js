/**
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

  /**
   * checked support
   */
  checked () {
    if (!window.fetch) {
      console.warn(`Browser unsupports fetch API (See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).`)
    }
  }

  /**
   * fetch server  
   */
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
  
  /**
   * polling request 
   * 
   */
  async _whileFetch (url) {
    const { maxtry } = this.options
    const result = await (async function dowhile (count, ctx) {
      const fetchResult = await ctx._fetch(url).catch(() => false)
      if (fetchResult) {    
        return fetchResult
      } else {
      console.log(count, url)
        return count++ < maxtry ? dowhile(count) : false
      }
    })(0, this)
    return result
  }

  _fetch (url) {  
    return fetch(url, this.options).catch(e => e)
  }
}

export default fetcher