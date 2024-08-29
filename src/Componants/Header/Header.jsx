import { useContext, useState } from "react";
import DropdownPrimitive from "@/Componants/Dropdown/Dropdown";
import DialogPrimitive from "@/Componants/DialogPrimitive/DialogPrimitive";
import { DataContext } from "../../Contexts/DataContext";
import AddNewBoredForm from "@/Componants/AddNewBoredForm/AddNewBoredForm";

const Header = () => {
  const { data, setData, selectedBoardIndex, setSelectedBoardIndex } =
    useContext(DataContext);
  const [open, setOpen] = useState(false);

  const onEditBoard = () => setOpen(true);

  const onDeleteBoard = () => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      setData((prevData) => {
        const newData = prevData.toSpliced(selectedBoardIndex, 1);
        setSelectedBoardIndex(0); // Reset to first board or adjust as needed
        return newData;
      });
    }
  };

  return (
    <header className="flex h-[97px] items-center border-b border-lines-light">
      <div className="flex flex-1 items-center z-[50] gap-4 pl-8 text-[32px] font-bold">
        Organizer
      </div>

      <div className="flex flex-[2] items-center justify-between pl-6 pr-6">
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-rocket"></i>
          <h2 className="text-heading-xl">
            {data[selectedBoardIndex]?.title || "No Board Selected"}
          </h2>
        </div>

        <DropdownPrimitive
          triggerComponent={() => (
            <button className="p-2 bg-gray-200 rounded">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
          )}
          items={{
            edit: { label: "Edit Board", onClick: onEditBoard },
            delete: { label: "Delete Board", onClick: onDeleteBoard },
          }}
        />

        <DialogPrimitive isOpen={open} setOpen={setOpen} title="Edit Board">
          <AddNewBoredForm
            toggleDialog={setOpen}
            title={data[selectedBoardIndex]?.title}
            columns={data[selectedBoardIndex]?.columns}
            boredId={data[selectedBoardIndex]?.id}
          />
        </DialogPrimitive>
      </div>
    </header>
  );
};

export default Header;
