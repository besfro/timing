/**
 * @name Formance
 * @desciption Measure performance mark
 */

class Formance {

  constructor (name, maxMarks = 10) {
    // save max performance mark
    this.maxMarks = maxMarks
    this.name = name
    this.marks = []
    this.markIndex = 0
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
    return performance.getEntriesByName(name)
  }

}

export default Formance
