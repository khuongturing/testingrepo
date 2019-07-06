import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import App from './App';
import Headers from './ShopMateHeader';
Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    addTodo: jest.fn()
  }

  const enzymeWrapper = shallow(<App  />)

  return {
    props,
    enzymeWrapper
  }
}


  describe('<App /> ', () => {
    it('renders 1 <Headers /> components', () => {
      const wrapper = shallow(<Headers />);
      expect(wrapper.find(Headers)).to.have.lengthOf(1);
    });

    
})