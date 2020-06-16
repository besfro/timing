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
    this.options = this.normalize(options)
    // fetcher instance. get the timestamp from timeServer
    this._fetch = new fetcher(options.timeServer)
    // time info
    this.timeInfo = {
      timestamp: Date.now(),
      mark: Date.now(),
      offset: 0,
      serverTimingOffset: 0,
      serverTiming: {}
    }
    // custom handler
    this.fetchHandler = options.fetchHandler
  }
  
  /**
   * Set a timed task
   * @param {String} dateString - a format start date (e.g. 2020-10-10 21:11:11) 
   * @param {Function} process - something to do 
   * @return {Object} delay - task delay time, clear() - clear this timed task
   */
  task (dateString, process) {

  }

  /**
   * Get the precise time from timeServer 
   * @return <Promise> request result 
   */
  async fetch () {
    const fetchResult = await this._fetch().catch(e => e)
    const timestamp = this.fetchHandler(fetchResult) || Date.now()
    // update instance time
    this.updateTimeInfo(timestamp)
    // presice timestamp
    this.timing()
  }

  /**
   * updateTiming 
   */
  updateTimeInfo (timestamp = Date.now(), serverTiming = {}) {
    const { timeInfo } = this
    const { responseEnd, responseStart } = serverTiming
    timeInfo.timestamp = timestamp
    timeInfo.mark = Date.now()
    timeInfo.serverTiming = serverTiming 
    if (responseEnd && responseStart) {

    } else {
      console.warn(`Can't get responseStart or responseEnd from Resource Timing API. Make sure 'Timing-Allow-Origin' header is present on the requested resource. [see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin]`)
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

  }

  _fetch () {}

  _normalize (options) {
    const { headers, body } = options.headers
    const headers = Object.assign({}, config.headers, options.headers)
    const body = Object.assign({}, config.body, options.body) 
    return Object.assign({}, config, options, { headers, body })
  }
}

export default Timing