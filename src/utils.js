const numFixed = num => {
  return num < 10 ? `0${num}` : num
}

// fixed decimal number
const toFixed = (val, decimal = 2) => {
  const num = +val || 0
  const base = Math.pow(10, decimal)
  return Math.round(num * base) / base
}

// just accept format 2020-01-01 21:01:01
const dateStringParser = (dateString = '') => {
  const regexp = new RegExp(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/)
  const match = dateString.match(regexp)
  if (!match) {
    return
  }
  const [ year, month, day, hours, minutes, second ] = match
  const date = new Date()
  date.setFullYear(+year)
  date.setMonth(month - 1)
  date.setDate(day)
  date.setHours(hours) 
  date.setMinutes(minutes) 
  date.setSeconds(second) 
  return {
    match,
    date,
    dateString,
    timestamp: +date
  }
}

// date parser
// just accpet timestamp
const dateParser = timestamp => {
  if (!timestamp) {
    return
  }
  const instance = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const [ year, month, date, hours, minutes, seconds, milliseconds] = [
    instance.getFullYear(),
    instance.getMonth(),
    instance.getDate(),
    instance.getHours(),
    instance.getMinutes(),
    instance.getSeconds(),
    instance.getMilliseconds()
  ]
  const dateString = `${year}年${month}月${date}日`
  const timeString = `${numFixed(hours)}:${numFixed(minutes)}:${numFixed(seconds)}`
  return {
    instance,
    timestamp: +date,
    year,
    month,
    date,
    hours,
    minutes,
    seconds,
    milliseconds,
    dateString,
    timeString,
    string: `${dateString} ${timeString}`
  } 
}

export {
  dateStringParser,
  dateParser,
  toFixed
}