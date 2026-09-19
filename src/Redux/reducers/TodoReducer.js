export const Todoreducer = (state={todos:[]}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {todos:[...state.todos,action.payload]};
    case "REMOVE_TODO":
        return [...state, action.payload];
    default:
      return state;
  }
};


export const Todoreducerb = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload] ;
    case "REMOVE_TODO":
      return [];
    default:
      return state;
  }
};

