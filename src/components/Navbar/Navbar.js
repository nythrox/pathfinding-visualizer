import pencil from "../../assets/edit-6-64.ico"; // Tell Webpack this JS file uses this image
import eraser from "../../assets/eraser-64.ico"; // Tell Webpack this JS file uses this image
import active_eraser from "../../assets/active_eraser.ico"; // Tell Webpack this JS file uses this image
import reset from "../../assets/reset.png"; // Tell Webpack this JS file uses this image
import active_pencil from "../../assets/active_edit.ico"; // Tell Webpack this JS file uses this image
import play from "../../assets/play-6-64.ico";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  useContext
} from "react";
import { AppContext } from "../AppBloc";
import { blockStatement } from "@babel/types";
export default function Navbar() {
  const [activeTool, setActiveTool] = useState("pencil");

  const pencilClicked = () => {
    window.tool = "addWall";
    setActiveTool("pencil");
  };
  const eraserClicked = () => {
    window.tool = "removeWall";
    setActiveTool("eraser");
  };
  const [rows, setRows] = useState()
  const [cols, setCols] = useState()

  const appBloc = useContext(AppContext);


  return (
    <nav>
      <ul>
        <li
          onClick={() => {
            appBloc.playAnimation$.next(true);
          }}
        >
          <img width="30px" src={play} alt="play pathfinder" />
        </li>
        <li
          onClick={() => {
            appBloc.resetBoard$.next(true);
          }}
        >
          <img width="40px" src={reset} alt="reset grid" />
        </li>
        <li>
          <img
            src={activeTool === "pencil" ? active_pencil : pencil}
            width="30"
            alt="draw wall"
            onClick={pencilClicked}
          />
        </li>
        <li>
          <img
            src={activeTool === "eraser" ? active_eraser : eraser}
            width="30"
            alt="remove wall"
            onClick={eraserClicked}
          />
        </li>
        <li>
          rows:
          <input type="number" value={rows} placeholder="20"onChange={(e)=>{setRows(e.target.value)}} />
          cols:
          <input type="number" value={cols} placeholder="50" onChange={(e)=>{setCols(e.target.value)}} />
          <input
            type="submit"
            value="create grid"
            onClick={() => {
              let _rows = 20;
              let _cols = 50;
              if (!(rows === undefined || rows === "")) _rows = rows;
              if (!(cols === undefined || cols === "")) _cols = cols;
              if (_rows >= 2 && _cols >= 2) {
                appBloc.gridValues$.next({ rows: _rows, columns: _cols });
              }
            }}
          />
        </li>
      </ul>
    </nav>
  );
}
