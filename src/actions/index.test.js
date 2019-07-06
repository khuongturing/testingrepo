import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from './index'
import * as types from './types'
import fetchMock from 'fetch-mock'
import expect from 'expect' // You can use any testing library

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  it('Should create an action to search Product', () => {
    const text = 'searchTerm'
    const expectedAction = {
      type: types.SEARCH,
      searchTerm: text
    }
    expect(actions.searchProduct(text)).toEqual(expectedAction)
  })
})

describe('async actions', () => {
    afterEach(() => {
        fetchMock.restore()
    })
  
    it('Should check List of Categories when fetching categories has been done', () => {
        fetchMock.getOnce('/categories', {
         payload: [{"category_id":1,"name":"French",
         "description":"The French have always had an eye for beauty. One look at the T-shirts below and you'll see that same appreciation has been applied abundantly to their postage stamps. Below are some of our most beautiful and colorful T-shirts, so browse away! And don't forget to go all the way to the bottom - you don't want to miss any of them!","department_id":1},
         {"category_id":2,"name":"Italian","description":"The full and resplendent treasure chest of art, literature, music, and science that Italy has given the world is reflected splendidly in its postal stamps. If we could, we would dedicate hundreds of T-shirts to this amazing treasure of beautiful images, but for now we will have to live with what you see here. You don't have to be Italian to love these gorgeous T-shirts, just someone who appreciates the finer things in life!","department_id":1},
         {"category_id":3,"name":"Irish","description":"It was Churchill who remarked that he thought the Irish most curious because they didn't want to be English. How right he was! But then, he was half-American, wasn't he? If you have an Irish genealogy you will want these T-shirts! If you suddenly turn Irish on St. Patrick's Day, you too will want these T-shirts! Take a look at some of the coolest T-shirts we have!","department_id":1},
         {"category_id":4,"name":"Animal","description":" Our ever-growing selection of beautiful animal T-shirts represents critters from everywhere, both wild and domestic. If you don't see the T-shirt with the animal you're looking for, tell us and we'll find it!","department_id":2},
         {"category_id":5,"name":"Flower","description":"These unique and beautiful flower T-shirts are just the item for the gardener, flower arranger, florist, or general lover of things beautiful. Surprise the flower in your life with one of the beautiful botanical T-shirts or just get a few for yourself!","department_id":2},
         {"category_id":6,"name":"Christmas","description":" Because this is a unique Christmas T-shirt that you'll only wear a few times a year, it will probably last for decades (unless some grinch nabs it from you, of course). Far into the future, after you're gone, your grandkids will pull it out and argue over who gets to wear it. What great snapshots they'll make dressed in Grandpa or Grandma's incredibly tasteful and unique Christmas T-shirt! Yes, everyone will remember you forever and what a silly goof you were when you would wear only your Santa beard and cap so you wouldn't cover up your nifty T-shirt.","department_id":3},
         {"category_id":7,"name":"Valentine's","description":"For the more timid, all you have to do is wear your heartfelt message to get it across. Buy one for you and your sweetie(s) today!","department_id":3}] ,
        headers: { 'content-type': 'application/json' }
      })
  
      const expectedActions = [
        { type: types.SELECTED_CATEGORY, payload: [{"category_id":1,"name":"French",
        "description":"The French have always had an eye for beauty. One look at the T-shirts below and you'll see that same appreciation has been applied abundantly to their postage stamps. Below are some of our most beautiful and colorful T-shirts, so browse away! And don't forget to go all the way to the bottom - you don't want to miss any of them!","department_id":1},
        {"category_id":2,"name":"Italian","description":"The full and resplendent treasure chest of art, literature, music, and science that Italy has given the world is reflected splendidly in its postal stamps. If we could, we would dedicate hundreds of T-shirts to this amazing treasure of beautiful images, but for now we will have to live with what you see here. You don't have to be Italian to love these gorgeous T-shirts, just someone who appreciates the finer things in life!","department_id":1},
        {"category_id":3,"name":"Irish","description":"It was Churchill who remarked that he thought the Irish most curious because they didn't want to be English. How right he was! But then, he was half-American, wasn't he? If you have an Irish genealogy you will want these T-shirts! If you suddenly turn Irish on St. Patrick's Day, you too will want these T-shirts! Take a look at some of the coolest T-shirts we have!","department_id":1},
        {"category_id":4,"name":"Animal","description":" Our ever-growing selection of beautiful animal T-shirts represents critters from everywhere, both wild and domestic. If you don't see the T-shirt with the animal you're looking for, tell us and we'll find it!","department_id":2},
        {"category_id":5,"name":"Flower","description":"These unique and beautiful flower T-shirts are just the item for the gardener, flower arranger, florist, or general lover of things beautiful. Surprise the flower in your life with one of the beautiful botanical T-shirts or just get a few for yourself!","department_id":2},
        {"category_id":6,"name":"Christmas","description":" Because this is a unique Christmas T-shirt that you'll only wear a few times a year, it will probably last for decades (unless some grinch nabs it from you, of course). Far into the future, after you're gone, your grandkids will pull it out and argue over who gets to wear it. What great snapshots they'll make dressed in Grandpa or Grandma's incredibly tasteful and unique Christmas T-shirt! Yes, everyone will remember you forever and what a silly goof you were when you would wear only your Santa beard and cap so you wouldn't cover up your nifty T-shirt.","department_id":3},
        {"category_id":7,"name":"Valentine's","description":"For the more timid, all you have to do is wear your heartfelt message to get it across. Buy one for you and your sweetie(s) today!","department_id":3}]   }
      ]
      const store = mockStore({ payload: [] })
  
      return store.dispatch(actions.selectCategory()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })