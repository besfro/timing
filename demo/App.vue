<template>
  <div id="app">
    <div id="now">{{ dateString || 'loading' }}</div>
    <div>{{ offsetText }}</div>
  </div>
</template>

<script>
import Timing from '../src/timing'

export default {
  name: 'App',
  data () {
    return {
      timing: null,
      timeInfo: null,
      dateString: null
    }
  },
  computed: {
    offsetText () {
      // 精确度 offset 5毫秒内都属于校准
      const precision = 5
      const { offset = 0 } = this.timeInfo || {}
      const seconds = Math.ceil(offset / 1000)
      if (offset === 0 || Math.abs(offset) < precision) {
        return `您的系统时间已校准`
      } else if (offset < 0) {
        return `您的系统时间慢了 ${seconds} 秒`
      } else if(offset > 0) {
        return `您的系统时间快了 ${seconds} 秒`
      }
    }
  },
  mounted () {
    this.initial()
  },
  methods: {
    async initial () {
      const timing = this.timing = new Timing()
      this.timeInfo = await timing.fetch()
      console.log(this.timeInfo)
      setTimeout(() => this.runTiming())
    },
    runTiming () {
      setInterval(() => {
        const now = this.timing.now()
        const milliseconds = Math.floor(now.milliseconds / 10)
        const millisecondsFixed = milliseconds < 10 ? ('0' + milliseconds) : milliseconds
        this.dateString = `${now.string} ${millisecondsFixed}`
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
