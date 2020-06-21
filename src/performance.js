/**
 * @name Formance
 * @desciption Measure performance mark
 */

class Formance {

  constructor (name, maxMarks = 2) {
    // save max performance mark
    this.maxMarks = maxMarks
    this.name = name
    this.marks = []
    this.markIndex = 0
    this.checked()
  }

  checked () {
    // need performance api
    if (!window.performance) {
      console.warn(`Browser unsupport Web Performance API`)
    }
  }

  mark () {
    const { maxMarks, marks, name, markIndex } = this
    const len = marks.length
    const markName = `${name}-${markIndex}`
    this.markIndex += 1 
    if (len >= maxMarks) {
      marks.splice(0, 2)
    }
    performance.mark(markName)
    this.marks.push(markName)
  }

  measure () {
    const { marks, name } = this
    const len = marks.length
    if (len < 2) {
      return
    }
    performance.measure(name, marks[len - 2], marks[len - 1])
    const entries = performance.getEntriesByName(name)[0]
    performance.clearMarks()
    performance.clearMeasures()
    return entries
  }

  clearResource () {
    performance.clearResourceTimings()
  }

}

export default Formance
