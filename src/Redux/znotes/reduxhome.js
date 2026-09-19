import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddTodoAction } from "../action/TodoActions";

const Reduxhome = () => {
  const [todo, setTodo] = useState("");
  const dispatch = useDispatch();
  const Todo = useSelector((state) => state.Todo);
  const todos = Todo.todos;

  const addTodo = () => {
    dispatch(AddTodoAction(todo));
  };

  return (
    <div className="w3-card-4 w3-white w3-round w3-padding">
      {todos.map((t) => (
        <div key={t.id}>
          <label>{`Name ${t.todo}  ${t.id}  `}</label>
        </div>
      ))}

      <input onChange={(e) => setTodo(e.target.value)} />
      <button onClick={() => addTodo()}> Add New Todo</button>
    </div>
  );
};

export default Reduxhome;
