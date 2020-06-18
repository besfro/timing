/**
 * @name Timing.js
 * @desciption This class is used to perform some tasks at precise timed  
 * @author Lengchars@gmail.com
 */

 
// default options
import config from './config'
// fetcher
import Fetcher from './fetcher'
// performance
import Performance from './performance'
// utils
import { dateStringParser, dateParser, toFixed } from './utils'

/**
 * @class
 * @name Timing
 * @description create a timing instance
 */
class Timing {

  constructor (options = {}) {
    // normalize options
    const opts = this.options = this._normalize(options)
    // fetcher instance. get the timestamp from timeServer
    this._fetcher = new Fetcher(opts.timeServer)
    // performance toolW
    this._performance = new Performance('timing')
    // time info
    this.timeInfo = {
      // timeServer response timestamp
      timestamp: Date.now(),
      // mark now time when fetch response end
      mark: Date.now(),
      // server time and client time seconds offset
      offset: 0,
      // server time and client time millseconds offset
      offsetMillseconds: 0,
      // response start and response end offset
      requestOffset: 0,
      // performance resource timing
      serverTiming: {}
    }
    // is already fetch timeServer
    this.isFetch = false
    // custom handler
    opts.fetchHandler && (this.fetchHandler = opts.fetchHandler)
  }
  
  /**
   * Set a timed task
   * @param {String} dateString - a format start date (e.g. 2020-10-10 21:11:11) 
   * @param {Function} process - something to do 
   * @return {Object} delay - task delay time, clear() - clear this timed task
   */
  task (dateString, process) {
    const { isFetch } = this
    // fetch the timeServer before call task function
    if (!isFetch) {
      console.warn(`Fetch timeServer before call task function`)
    }
    // parser dateString
    const dateParser = dateStringParser(dateString)
    if (!dateParser) {
      console.error(`Invalid dateString format. e.g. 2019-01-01 06:06:06`)
      return
    }
    
    // delay run
    const delay = dateParser.timestamp - this.now()
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
    const fetchResult = await this._fetcher.fetch().catch(e => e)
    // mark now
    this.timeInfo.mark = Date.now()
    // performance mark
    this._performance.mark()
    // set tag
    this.isFetch = true
    // handler 
    const timestamp = this.fetchHandler(fetchResult) || Date.now()
    console.log(timestamp - this.timeInfo.mark)
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
      // performance mark
      this._performance.mark()
      // time consuming
      let measure = this._performance.measure() || {}
      let consuming = measure.duration || 0
      // mill seconds offset
      timeInfo.offsetMillseconds = toFixed(
        timeInfo.mark - consuming - (timestamp + timeInfo.requestOffset), 4
      )
      // seconds offset
      timeInfo.offset = toFixed(timeInfo.offsetMillseconds / 1000, 2)
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
      return res.timestamp
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
    const timestamp = this._now()
    return dateParser(timestamp)
  }

  _now () {
    const { timeInfo: { timestamp, offset, mark } } = this
    return timestamp + offset + Date.now() - mark
  }

  _getPerformaceTiming () {
    // need performance api
    if (!window.performance) {
      console.warn(`Browser unsupport Web Performance API`)
      return null
    }

    const { timeServer } = this.options
    const timing = performance.getEntries().filter(item => item.name === timeServer.url)[0]
    
    if (!timing || !timing.responseStart) {
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
    const headers = Object.assign({}, config.headers, options.headers)
    const body = Object.assign({}, config.body, options.body) 
    return Object.assign({}, config, options, { headers, body })
  }

  // fetcher instance
  _fetcher () {}

  //
  _performance () {}
}

export default Timing