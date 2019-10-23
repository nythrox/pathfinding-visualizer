import React, { useState, useEffect, useContext } from "react";
import GridNode from "./GridNode/GridNode";
import { GridNodeModel } from "../models/GridNodeModel";
import Navbar from "./Navbar/Navbar";
import { AppContext } from "./AppBloc";
import Grid from "./Grid/Grid.js";

function App() {
  const appBloc = useContext(AppContext);
  useEffect(() => {
    window.canEdit = false;
    window.tool = "addWall";
    document.onmousedown = () => {
      window.isMouseDown = true;
    };
    document.onmouseup = () => {
      window.isMouseDown = false;
      if (window.isDragging)
      window.isDragging = false;
    };
    const gameStateSubscription = appBloc.gameState$.subscribe(e => {
      if (e === appBloc.GameStateEnum.idle) {
        window.canDrag = true;
        window.canEdit = true;
      } else {
        window.canDrag = false;
        window.canEdit = false;
      }
    });
    return () => {
      appBloc.dispose();
      gameStateSubscription.unsubscribe();
    };
  });
  return (
    <div className="App">
      <Navbar />
      <div className="pixelart-to-css"></div>
      <Grid columns={50} rows={20} />
    </div>
  );
}

export default App;
