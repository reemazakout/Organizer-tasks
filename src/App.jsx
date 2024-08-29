import { useEffect, useState } from "react";
import Header from "@/Componants/Header/Header";
import AsideMenu from "@/Componants/AsideMenu/AsideMenu";
import WorkSpace from "@/Componants/WorkSpace/WorkSpace";
import { DataContext } from "./Contexts/DataContext";

export default function App() {
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(0);
  const [dataState, setDataState] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("data");
    if (savedData) {
      setDataState(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(dataState));
  }, [dataState]);

  return (
    <>
      <DataContext.Provider
        value={{
          data: dataState,
          setData: setDataState,
          selectedBoardIndex,
          setSelectedBoardIndex,
        }}
      >
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex flex-1">
            <AsideMenu />
            <WorkSpace />
          </div>
        </div>
      </DataContext.Provider>
    </>
  );
}
