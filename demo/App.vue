<template>
  <div id="app">
    <div id="now">{{ dateString || 'loading' }}</div>
    <div>{{ offsetText }}</div>
    <div id="test">
      <button @click="timingTest">test timing</button>
      <select placeholder="select test count" v-model="testCount">
        <option v-for="item in 5" :value="item * 10" :key="item">{{item * 10}}</option>
      </select>
      <table border="0">
        <tr>
          <th>offset</th>
          <th>offsetMillseconds</th>
          <th>timestamp</th>
          <th>mark</th>
          <th>responseStart</th>
          <th>responseEnd</th>
          <th>consuming</th>
        </tr>
        <tr v-for="item of testArr" :key="item.cnt">
          <td>{{item.offset}}</td>
          <td>{{item.offsetMillseconds}}</td>
          <td>{{item.timestamp}}</td>
          <td>{{item.mark}}</td>
          <td>{{item.serverTiming.responseStart}}</td>
          <td>{{item.serverTiming.responseEnd}}</td>
          <td>{{item.consuming}}</td>
        </tr>
      </table>
    </div>
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
      dateString: null,
      testArr: [],
      testCount: 20
    }
  },
  computed: {
    offsetText () {
      // 精确度 offset 5毫秒内都属于校准
      const precision = 10
      const { offset = 0, offsetMillseconds = 0 } = this.timeInfo || {}
      if (offsetMillseconds === 0 || Math.abs(offsetMillseconds) < precision) {
        return `您的系统时间已校准`
      } else if (offset < 0) {
        return `您的系统时间慢了 ${offset} 秒`
      } else {
        return `您的系统时间快了 ${offset} 秒`
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
      }, 10)
    },
    timingTest () {
      const max = this.testCount
      const fetch = async cnt => {
        if (cnt++ < max) {
          let timing = JSON.parse(
            JSON.stringify(
              await this.timing.fetch()
            )
          )
          timing.key = cnt
          console.log(timing)
          this.testArr.push(timing)
          fetch(cnt)    
        }
      }
      this.testArr = []
      fetch(0)
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
#test {
  margin: 30px auto;
  width: 1200px;
}
#test button {
  margin-right: 10px;
}
#test table {
  margin-top: 20px;
  width: 100%
}
</style>
