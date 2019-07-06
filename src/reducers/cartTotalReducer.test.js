import reducer from './cartTotalReducer'


describe('cartTotalReducer', () => {
  it('should return the initial state', () => {
    expect(reducer([])).toEqual([])
  })
 
})