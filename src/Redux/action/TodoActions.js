export const AddTodoAction = (todo) => (dispatch, getState) => {
  const { Todo } = getState();
  dispatch({ type: "ADD_TODO", payload: { todo, id: Todo.todos.length + 1 } });
};

export const RemoveTodoAction = (index) => (dispatch, getState) => {
  dispatch({ type: "REMOVE_TODO", payload: index});
};
