import TextField from "@/Componants/TextField/TextField";
import Button from "@/Componants/Button/Button";
import iconCross from "@/assets/icon-cross.svg";
import { useContext, useState } from "react";
import { DataContext } from "../../Contexts/DataContext";

export default function AddNewBoredForm({
  boredId,
  toggleDialog,
  title,
  columns = [{ id: Date.now() }],
}) {
  const { setSelectedBoardIndex, setData } = useContext(DataContext);
  const [columnsArray, setColumnsArray] = useState(columns);

  const handleRemoveColumn = (id) => {
    setColumnsArray((prev) => prev.filter((obj) => obj.id !== id));
  };

  const handleAddColumn = () => {
    setColumnsArray((prev) => [...prev, { id: Date.now() }]);
  };

  const creatNewColumnsArray = (formData, columnsArray, boredId) => {
    return columnsArray.map((column) => {
      const tasksArray = boredId ? column.tasks : [];

      return {
        id: column.id,
        title: formData.get(column.id),
        tasks: tasksArray,
      };
    });
  };

  const updateData = (boardName, newColumnsArray, boredId) => {
    if (boredId) {
      setData((prevData) => {
        return prevData.map((board) => {
          if (board.id === boredId) {
            return { ...board, title: boardName, columns: newColumnsArray };
          }
          return board;
        });
      });
    } else {
      const newBoard = {
        id: Date.now(),
        title: boardName,
        columns: newColumnsArray,
      };

      setData((prevData) => {
        const updatedData = [...prevData, newBoard];
        setSelectedBoardIndex(updatedData.length - 1); // Set to the last board's index
        return updatedData;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const boardName = formData.get("boardName");
    const newColumnsArray = creatNewColumnsArray(
      formData,
      columnsArray,
      boredId
    );

    updateData(boardName, newColumnsArray, boredId);

    toggleDialog(false); // Close the dialog after submission
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <h3 className="pb-2 pt-6 text-body-m text-medium-grey">Name</h3>
          <TextField
            placeholder="Add your board name"
            name="boardName"
            required
            defaultValue={title}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="pt-6 text-body-m text-medium-grey">Columns</h3>

          {columnsArray.map((obj) => (
            <div key={obj.id} className="flex items-center gap-4">
              <TextField
                placeholder="Add New Column"
                required
                defaultValue={obj.title}
                name={obj.id}
              />
              <button type="button" onClick={() => handleRemoveColumn(obj.id)}>
                <img src={iconCross} alt="icon cross" />
              </button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddColumn}
          >
            + Add New Column
          </Button>
        </div>
        <div className="mt-6">
          <Button type="submit" variant="primary" size="sm" isFullWidth>
            {boredId ? "Update Board" : "Create Board"}
          </Button>
        </div>
      </form>
    </>
  );
}
