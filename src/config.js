export default {
  timeServer: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    // 时间服务接口地址
    url: 'https://time.clcc.dev/timeis',
    // 备用地址
    fallback: 'https://time.clcc.dev/timeis',
    // 最大尝试次数
    maxtry: 10
  },
  /**
   * Custom timeServer fetch handler  
   */
  fetchHandler () {}
}