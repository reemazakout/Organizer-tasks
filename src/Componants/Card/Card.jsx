import { useContext, useState } from "react";
import { DataContext } from "../../Contexts/DataContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ title: initialTitle, columnId, cardId }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState(initialTitle); // Local state for editing
  const { setData, selectedBoardIndex } = useContext(DataContext);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: cardId, data: { columnId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleBlur = (e) => {
    setIsEditMode(false);
    if (e.target.value.trim() === initialTitle) return; // Prevent sending request if no changes

    setData((prevData) => {
      const newData = [...prevData];
      const newColumns = newData[selectedBoardIndex].columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) => {
              if (task.id === cardId) {
                return {
                  ...task,
                  title: e.target.value,
                };
              }
              return task;
            }),
          };
        }
        return column;
      });

      newData[selectedBoardIndex] = {
        ...newData[selectedBoardIndex],
        columns: newColumns,
      };

      return newData;
    });
  };

  const onDeleteHandler = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setData((prevData) => {
        const newData = [...prevData];
        const newColumns = newData[selectedBoardIndex].columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== cardId),
            };
          }
          return column;
        });

        newData[selectedBoardIndex] = {
          ...newData[selectedBoardIndex],
          columns: newColumns,
        };

        return newData;
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action of the Enter key
      handleBlur(e); // Pass the event parameter
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value); // Update local state for title
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="my-2 relative min-h-16 rounded-lg bg-white px-4 py-3 shadow-md hover:shadow-lg transition-shadow duration-200 group"
    >
      {isEditMode ? (
        <textarea
          className="h-full resize-none text-heading-m outline-light-grey"
          value={title} // Use local state
          onFocus={handleFocus}
          autoFocus
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChange={handleChange} // Update the local state on change
        />
      ) : (
        <button
          onClick={toggleEditMode}
          className="text-heading-m text-start peer-focus:text-main-purple text-black group-hover:text-main-purple"
        >
          {title}
        </button>
      )}

      <button
        className="absolute bottom-0 right-0 top-0 bg-white p-2 text-body-m text-red opacity-0 shadow duration-300 focus:opacity-100 group-hover:opacity-100 peer-focus:opacity-100"
        onClick={onDeleteHandler}
      >
        Delete
      </button>
    </div>
  );
}
