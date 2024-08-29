import { useContext } from "react";
import Card from "../Card/Card";
import { DataContext } from "../../Contexts/DataContext";
import { produce } from "immer";

export default function Column({ title, tasks = [], id }) {
  const { setData, selectedBoardIndex } = useContext(DataContext);

  const onDeleteHandler = () => {
    if (window.confirm(`Are you sure you want to delete this "${title}"?`)) {
      setData((prevData) =>
        produce(prevData, (draft) => {
          const selectedBoard = draft[selectedBoardIndex];
          if (!selectedBoard) return;
          selectedBoard.columns = selectedBoard.columns.filter(
            (column) => column.id !== id
          );
        })
      );
    }
  };

  const addNewTaskToColumn = (columns, columnId) => {
    return columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, { id: Date.now(), title: "New task" }],
        };
      }
      return column;
    });
  };

  const addNewTaskHandler = () => {
    setData((prevData) =>
      produce(prevData, (draft) => {
        const selectedBoard = draft[selectedBoardIndex];
        if (!selectedBoard) return;
        selectedBoard.columns = addNewTaskToColumn(selectedBoard.columns, id);
      })
    );
  };

  return (
    <div className="flex w-72 shrink-0 flex-col self-start rounded-lg bg-lines-light px-2 shadow-md">
      <h2 className="group/column relative top-0 rounded bg-lines-light px-2 py-4 text-heading-m">
        {title} ({tasks.length})
        <button
          className="absolute bottom-0 right-0 top-0 p-2 text-body-m text-red opacity-0 duration-300 focus:opacity-100 group-hover/column:opacity-100"
          onClick={onDeleteHandler}
        >
          Delete
        </button>
      </h2>
      <div className="flex flex-col gap-1">
        {tasks.map((task) => (
          <Card
            key={task.id}
            title={task.title}
            columnId={id}
            cardId={task.id}
          />
        ))}
      </div>
      <button
        onClick={addNewTaskHandler}
        className="-mx-2 mt-auto border-t border-light-grey bg-lines-light px-2 py-4 text-heading-m text-medium-grey"
      >
        + Add New Task
      </button>
    </div>
  );
}
