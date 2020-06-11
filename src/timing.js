/*
 * Timing.js
 * This class is used to perform some tasks at precise timed  
 * author Lengchars@gmail.com
 * 
 */

 
// default options
import config from './config'
// fetcher
import fetcher from './fetcher'

class Timing {

  constructor (options = {}) {
    this.options = Object.assign({}, config, options)
    options.timeServer.headers['Content-Type'] = 'application/json; charset=utf-8'
    this.fetch = new fetcher(options.timeServer)
  }

  /*
   * Set a timed task
   * @params <Number> timeout - delay time 
   * @return <Promise> task start 
   */
  task (timeout = 0) {

  }

  /*
   * Get the precise time from timeServer 
   * @return <Promise> fetch result 
   */
  fetch () {}

  /*
   * Set a timed task
   * @params <Number> timeout - delay time 
   * @return <Promise> task start 
   */
  toString () {

  }
}