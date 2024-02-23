export default class StateHolderModel {
  constructor () {
    this.states = []
    this.successStateIndex = 0
    this.errorStateIndex = 0
  }

  addState (isSuccessState) {
    this.states.push(isSuccessState)

    if (isSuccessState) {
      this.successStateIndex++
    } else {
      this.errorStateIndex++
    }
  }

  checkLastThreeStatesAreInvalid () {
    if (this.states.length < 3) return false
    const lastThreeElements = this.states.slice(-3)

    const lastElementsAreInvalid = lastThreeElements.filter(state => state === true).length === 0

    return lastElementsAreInvalid
  }
}
