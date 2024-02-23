import StateHolderModel from './state-holder.model'

describe(StateHolderModel.name, () => {
  it('should say that all states are invalid', () => {
    const stateHolder = new StateHolderModel()
    stateHolder.addState(true)
    stateHolder.addState(false)
    stateHolder.addState(false)
    stateHolder.addState(false)

    expect(stateHolder.checkLastThreeStatesAreInvalid()).toBe(true)
  })

  it('should say that all states are not invalid', () => {
    const stateHolder = new StateHolderModel()
    stateHolder.addState(false)
    stateHolder.addState(true)
    stateHolder.addState(false)
    stateHolder.addState(false)

    expect(stateHolder.checkLastThreeStatesAreInvalid()).toBe(false)
  })

  it('should return false when the array is empty', () => {
    const stateHolder = new StateHolderModel()

    expect(stateHolder.checkLastThreeStatesAreInvalid()).toBe(false)
  })
})
