/**
 * @name Timing.js
 * @desciption This class is used to perform some tasks at precise timed  
 * @author Lengchars@gmail.com
 */

 
// default options
import config from './config'
// fetcher
import fetcher from './fetcher'

/**
 * @class
 * @name Timing
 * @description create a timing instance
 */
class Timing {

  constructor (options = {}) {
    // normalize options
    const options = this.options = this.normalize(options)
    // fetcher instance. get the timestamp from timeServer
    this._fetch = new fetcher(options.timeServer)
    // time info
    this.timeInfo = {
      // timeServer response timestamp
      timestamp: Date.now(),
      // mark now time when fetch response end
      mark: Date.now(),
      // server time and client time offset
      offset: 0,
      // response start and response end offset
      requestOffset: 0,
      // performance resource timing
      serverTiming: {}
    }
    // is already fetch timeServer
    this.isFetch = false
    // custom handler
    options.fetchHandler && (this.fetchHandler = options.fetchHandler)
  }
  
  /**
   * Set a timed task
   * @param {String} dateString - a format start date (e.g. 2020-10-10 21:11:11) 
   * @param {Function} process - something to do 
   * @return {Object} delay - task delay time, clear() - clear this timed task
   */
  task (dateString, process) {
    const { isFetch } = this
    if (!isFetch) {
      console.warn(`Fetch timeServer before call task function`)
    }
    const delay = 0
    const id = setTimeout(() => process(), delay)
    return {
      id,
      delay,
      clear () {
        clearTimeout(id)
      }
    }
  }

  /**
   * Get the precise time from timeServer 
   * @return <Promise> request result 
   */
  async fetch () {
    // fetch timeServer
    const fetchResult = await this._fetch().catch(e => e)
    // mark now
    this.timeInfo.mark = Date.now()
    // handler 
    const timestamp = this.fetchHandler(fetchResult) || Date.now()
    const serverTiming = this.getServerTiming()
    // update instance time
    this.updateTimeInfo(timestamp, serverTiming)
    return this.timeInfo
  }

  /**
   * updateTiming 
   */
  updateTimeInfo (timestamp = Date.now(), serverTiming = {}) {
    const { timeInfo } = this
    const { responseEnd, responseStart } = serverTiming
    timeInfo.timestamp = timestamp
    timeInfo.serverTiming = serverTiming 
    if (responseEnd && responseStart) {
      timeInfo.requestOffset = responseEnd - responseStart
      timeInfo.offset = timestamp + timeInfo.requestOffset - timeInfo.mark
    }
  }

  getServerTiming () {
    const { timeInfo: { serverTiming }, isFetch } = this
    // is already fetch
    if (isFetch) {
      return this._getPerformaceTiming() || serverTiming
    } else {
      return serverTiming
    }
  }

  /**
   * Get the precise time from timeServer 
   * @return <Promise> request result 
   */
  fetchHandler (res) {
    if (res) {
      return res.json().timestamp
    } else {
      console.warn(`Can not get timestamp from timeServer. It will effect execution time`)
      return Date.now()
    }
  }

  /**
   * Get the current timestamp
   * @param <Number> timeout - delay time 
   * @return <Promise> task start 
   */
  now () {
    const { timeInfo: { timestamp, offset } } = this
    return timestamp + offset + Date.now() - this.mark
  }

  // fetcher instance
  _fetch () {}

  _getPerformaceTiming () {
    // need performance api
    if (!window.performance) {
      console.warn(`Browser unsupport Web Performance API`)
      return null
    }

    const { timeServer } = this
    const timing = performance.getEntries().filter(item => item.name === timeServer.url)[0]
    
    if (!timing.responseStart) {
      console.warn(
        `Can't get responseStart or responseEnd from Resource Timing API. 
         Make sure 'Timing-Allow-Origin' header is present on the requested resource.
         See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin
      `)
      return null
    }

    return timing
  }

  _normalize (options) {
    const { headers, body } = options.headers
    const headers = Object.assign({}, config.headers, options.headers)
    const body = Object.assign({}, config.body, options.body) 
    return Object.assign({}, config, options, { headers, body })
  }
}

export default Timing