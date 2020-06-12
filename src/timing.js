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
   * @params <String> dateString - a format start date (e.g. 2020-10-10 21:11:11) 
   * @params <Function> process - something to do 
   * @return <Object> props.delay - 
   * @return <Object> props.stop - 
   */
  task (dateString, process) {

  }

  /*
   * Get the precise time from timeServer 
   * @return <Promise> request result 
   */
  fetch () {}

  /*
   * Get the current timestamp
   * @params <Number> timeout - delay time 
   * @return <Promise> task start 
   */
  now () {

  }
}

export default Timing