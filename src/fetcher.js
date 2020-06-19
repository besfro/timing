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
    // this.checked()
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
      console.warn(`Can not get time from timeServer`)
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
        return count++ < maxtry ? dowhile(count, ctx) : false
      }
    })(0, this)
    return result
  }

  _fetch (url) {  
    const { method, headers } = this.options
    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest()
      xhr.open(method, url)
      Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
      xhr.responseType = 'json'
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          xhr.status === 200 ? res(xhr) : rej(xhr.response)
        }
      }
      xhr.send()
    })
  }
}

export default fetcher