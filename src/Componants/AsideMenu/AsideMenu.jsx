import clsx from "clsx";
import { useContext, useState } from "react";
import DialogPrimitive from "@/Componants/DialogPrimitive/DialogPrimitive";
import iconBoard from "@/assets/iconBoard.svg";
import { DataContext } from "../../Contexts/DataContext";
import AddNewBoredForm from "../AddNewBoredForm/AddNewBoredForm";

export default function AsideMenu() {
  const [open, setOpen] = useState(false);
  const { data, selectedBoardIndex, setSelectedBoardIndex } =
    useContext(DataContext);

  return (
    <aside className="side-menu h-screen w-[300px] border-r border-lines-light bg-white -mt-[97px] pt-[97px]">
      <p className="px-8 py-4 text-heading-l">All boards</p>
      <ul>
        {data.map((item, index) => {
          return (
            <li key={item.id}>
              <button
                data-isactive={selectedBoardIndex === index}
                onClick={() => setSelectedBoardIndex(index)}
                className={clsx(
                  "flex w-11/12 items-center gap-4 rounded-e-full px-8 py-4 text-heading-m text-medium-grey transition data-[isactive=false]:hover:bg-main-purple/10 data-[isactive=false]:hover:text-main-purple",
                  {
                    "bg-main-purple !text-white hover:bg-main-purple":
                      selectedBoardIndex === index,
                  }
                )}
              >
                <img src={iconBoard} alt="" />
                {item.title}
              </button>
            </li>
          );
        })}
        <li className="py-4">
          <DialogPrimitive
            onClick={() => setOpen(true)}
            title=" + Create New Board"
            isOpen={open}
            setOpen={setOpen}
            triggerComponent={
              <button className="flex w-11/12 items-center  gap-4 rounded-e-full px-8 py-4 text-heading-m text-medium-grey transition data-[isactive=false]:hover:bg-main-purple/10 data-[isactive=false]:hover:text-main-purple bg-lines-light">
                <img src={iconBoard} alt="" />
                +Create New Board
              </button>
            }
          >
            <AddNewBoredForm toggleDialog={setOpen} />
          </DialogPrimitive>
        </li>
      </ul>
    </aside>
  );
}
