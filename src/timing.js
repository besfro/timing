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
    this.options = Object.assign({}, config, options)
    options.timeServer.headers['Content-Type'] = 'application/json; charset=utf-8'
    this.fetch = new fetcher(options.timeServer)
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
  fetch () {}

  /**
   * Get the current timestamp
   * @param <Number> timeout - delay time 
   * @return <Promise> task start 
   */
  now () {

  }
}

export default Timing