import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DataContext } from "../../Contexts/DataContext";
import Column from "../Column/Column";
import { produce } from "immer";
import { useContext, useMemo } from "react";

const Workspace = () => {
  const { data, setData, selectedBoardIndex } = useContext(DataContext);

  // Check if data and selectedBoardIndex are valid
  const columns = data?.[selectedBoardIndex]?.columns || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const createNewColumn = (num) => ({
    id: Date.now(),
    title: `New Column ${num}`,
    tasks: [],
  });

  const addNewColumnHandler = () => {
    if (!data[selectedBoardIndex]) return; // Guard clause

    const num = columns.length; // use columns directly
    const newColumn = createNewColumn(num);

    setData((prev) =>
      produce(prev, (draft) => {
        if (draft[selectedBoardIndex]) {
          draft[selectedBoardIndex].columns.push(newColumn);
        }
      })
    );
  };

  const tasksIds = useMemo(() => {
    let tasksIds = [];

    if (!columns || columns.length === 0) return tasksIds;
    for (let column of columns) {
      tasksIds = [...tasksIds, ...column.tasks.map((task) => task.id)];
    }
    return tasksIds;
  }, [columns]);

  const onDragEndHandler = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const overColumnId = over.data.current.columnId;
    const activeColumnId = active.data.current.columnId;

    if (activeId === overId) return;

    if (activeColumnId === overColumnId) {
      // Reorder within the same column
      setData((prev) =>
        produce(prev, (draft) => {
          const column = draft[selectedBoardIndex].columns.find(
            (col) => col.id === activeColumnId
          );
          if (column) {
            const activeIndex = column.tasks.findIndex(
              (task) => task.id === activeId
            );
            const overIndex = column.tasks.findIndex(
              (task) => task.id === overId
            );
            if (activeIndex !== -1 && overIndex !== -1) {
              column.tasks = arrayMove(column.tasks, activeIndex, overIndex);
            }
          }
        })
      );
    }
  };

  const onDragOverHandler = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overColumnId = over?.data?.current?.columnId;
    const activeColumnId = active?.data?.current?.columnId;

    if (overColumnId && activeColumnId !== overColumnId) {
      setData((prev) =>
        produce(prev, (draft) => {
          const sourceColumn = draft[selectedBoardIndex].columns.find(
            (col) => col.id === activeColumnId
          );
          const destinationColumn = draft[selectedBoardIndex].columns.find(
            (col) => col.id === overColumnId
          );

          if (sourceColumn && destinationColumn) {
            const taskIndex = sourceColumn.tasks.findIndex(
              (task) => task.id === activeId
            );
            if (taskIndex !== -1) {
              const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
              destinationColumn.tasks.push(movedTask);
            }
          }
        })
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOverHandler}
    >
      <div className="flex h-[calc(100vh-97px)] flex-1 gap-6 overflow-auto bg-light-grey p-6">
        {columns.length === 0 ? (
          <div className="text-heading-l p-3 text-red text-center w-full h-full flex justify-center items-center">
            Create new boards first!
          </div>
        ) : (
          <SortableContext
            items={tasksIds}
            strategy={verticalListSortingStrategy}
          >
            {columns.map((item, index) => (
              <Column
                key={`${item.id}${item.title}`}
                id={item.id}
                title={item.title}
                tasks={item.tasks}
                columnIndex={index}
              />
            ))}
          </SortableContext>
        )}
        {columns.length === 0 ? (
          ""
        ) : (
          <button
            className="w-72 shrink-0 self-start rounded-md bg-lines-light p-3 text-heading-l text-medium-grey"
            onClick={addNewColumnHandler}
          >
            + New Column
          </button>
        )}
      </div>
    </DndContext>
  );
};

export default Workspace;
