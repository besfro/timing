/*
 * Timing.js
 * This class is used to perform some precise tasks  
 * author Lengchars@gmail.com
 * 
 */

// default options
const getDefOptions = () => {
  return {
    // 获取精准时间的服务接口
    timeServer: {
      method: 'GET',
      // 时间服务接口地址
      url: 'https://time.clcc.dev/timeis',
      // 备用地址
      fallback: 'https://time.clcc.dev/timeis',
      // 最大尝试次数
      maxtry: 10
    }
  }
}

class Timing {
  constructor () {

  }

  task(timeout = 0) {

  }
}