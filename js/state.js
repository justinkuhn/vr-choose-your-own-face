AFRAME.registerState({
  initialState: {
//    only numbers strings and booleans for state, unless we use bind for
      scene: 'startScreen',
      shoppingList: [
      {name: 'milk', amount: 2},
      {name: 'eggs', amount: 12}
    ]
  },
 
  handlers: {
    decreaseScore: function (state, action) {
      state.score -= action.points;
    },
 
    increaseScore: function (state, action) {
      state.score += action.points;
    }
  }
});