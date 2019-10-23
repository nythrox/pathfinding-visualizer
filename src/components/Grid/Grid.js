import React, { useState, useEffect, useContext } from "react";
import { GridNodeModel } from "../../models/GridNodeModel";
import GridNode from "../GridNode/GridNode";
import {
  dijkstra,
  getNodesInShortestPathOrder
} from "../../algorithms/dijkstra";
import { AppContext } from "../AppBloc";
import { blockStatement } from "@babel/types";

function Grid(props) {
  const [startNodePos, setStartNodePos] = useState({ x: 5, y: 7 });
  const [finishNodePos, setFinishNodePos] = useState({ x: 20, y: 8 });
  const [grid, setGrid] = useState([]); //obs: I am directly mutating state because of performance issues for having so many tiles
  const appBloc = useContext(AppContext);
  const [gridSize, setGridSize] = useState({
    columns: 50,
    rows: 20
  });
  useEffect(() => {
    console.log("started");
    if (grid.length === 0) {
      setGrid(
        generateNewPhysicalGrid(
          props.rows,
          props.columns,
          startNodePos,
          finishNodePos
        )
      );
    }
    const playSubscription = appBloc.playAnimation$.subscribe(e => {
      handleAnimateClick();
    });
    const resetSubscription = appBloc.resetBoard$.subscribe(e => {
      handleResetClick();
    });
    const gridSubscription = appBloc.gridValues$.subscribe(e => {
      setGridSize(e);
      setGrid(
        generateNewPhysicalGrid(e.rows, e.columns, startNodePos, finishNodePos)
      );
    });
    return () => {
      playSubscription.unsubscribe();
      resetSubscription.unsubscribe();
      gridSubscription.unsubscribe();
    };
  }, [grid, props, startNodePos, finishNodePos, appBloc]);

  const handleAnimateClick = () => {
    if (appBloc.gameState$._value === appBloc.GameStateEnum.idle) {
      appBloc.gameState$.next(appBloc.GameStateEnum.rendering);
      setGrid(generateNewPhysicalGridPreserveWalls(grid));
      console.log("set grid");
      appBloc.gameState$.next(appBloc.GameStateEnum.animating);
      visualizeDijkstra();
    }
  };

  const handleResetClick = () => {
    var clearTimeoutId = setTimeout(";", 0); //timeout to clear all other timeouts
    for (var i = 0; i < clearTimeoutId; i++) {
      clearTimeout(i);
    }

    setGrid(
      generateNewPhysicalGrid(
        gridSize.rows,
        gridSize.columns,
        startNodePos,
        finishNodePos
      )
    );
    appBloc.gameState$.next(appBloc.GameStateEnum.idle);
  };

  const visualizeDijkstra = () => {
    const currentGrid = grid.slice();
    const visitedNodesInOrder = dijkstra(
      currentGrid,
      currentGrid[startNodePos.y][startNodePos.x],
      currentGrid[finishNodePos.y][finishNodePos.x]
    );
    let nodesInShortestPathOrder = getNodesInShortestPathOrder(
      currentGrid[finishNodePos.y][finishNodePos.x]
    );
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const toggleActive = (col, row) => {
    if (window.tool === "addWall") {
      grid[row][col].isWall = true;
    } else {
      grid[row][col].isWall = false;
    }
  };

  const toggleStart = (col, row) => {
    if (grid[row][col].isStart === true) {
      grid[row][col].isStart = false;
    } else {
      startNodePos.x = col;
      startNodePos.y = row;
      grid[row][col].isStart = true;
    }
  };

  const toggleFinish = (col, row) => {
    if (grid[row][col].isFinish === true) {
      grid[row][col].isFinish = false;
    } else {
      finishNodePos.x = col;
      finishNodePos.y = row;
      grid[row][col].isFinish = true;
    }
  };

  const addRefToList = (col, row, ref) => {
    grid[row][col].ref = ref;
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 25 * i);
        return;
      }

      setTimeout(() => {
        var others = document.getElementsByClassName("current-visited");
        if (others.length > 0) {
          for (let o = 0; o < others.length; o++) {
            var other = others[o];
            if (other !== undefined) {
              other.classList.remove("current-visited");
              other.classList.add("visited");
            }
          }
        }
        node.ref.current.classList.add("current-visited");
      }, 25 * i);
    }
  };

  const animateShortestPath = nodesInShortestPathOrder => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length - 1) {
        appBloc.gameState$.next(appBloc.GameStateEnum.idle);
      }
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        node.ref.current.classList.add("shortest-path");
      }, 30 * i);
    }
  };
  return (
    <div className="grid-container">
      {grid.map((row, index) => (
        <div className="grid-row" key={index}>
          {row.map(node => (
            <GridNode
              key={node.id}
              col={node.col}
              row={node.row}
              id={node.id}
              isStart={node.isStart}
              isFinish={node.isFinish}
              isWall={node.isWall}
              toggleActive={toggleActive}
              addRefToList={addRefToList}
              model={node}
              toggleFinish={toggleFinish}
              toggleStart={toggleStart}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;

const generateNewPhysicalGrid = (
  rows,
  columns,
  startNodePos,
  finishNodePos
) => {
  let grid = [];
  let id = 0;
  let startPos = startNodePos;
  let finishPos = finishNodePos;
  if (startNodePos.x >= columns) {
    startPos.x = 0;
  }
  if (startNodePos.y >= rows) {
    startPos.y = 0;
  }
  if (finishNodePos.x >= columns) {
    finishPos.x = columns - 1;
  }
  if (finishNodePos.y >= rows) {
    finishPos.y = rows - 1;
  }
  for (let row = 0; row < rows; row++) {
    let currentRow = [];
    for (let col = 0; col < columns; col++) {
      currentRow.push(
        new GridNodeModel(
          col, //col
          row, //row
          id, //id
          col === startPos.x && row === startPos.y, //isStart
          col === finishPos.x && row === finishPos.y, //isEnd
          Infinity, //distance
          false, //isVisited
          false, //isWall
          null, //previousNode
          null //ref
        )
      );
      id++;
    }
    grid.push(currentRow);
  }
  return grid;
};
const generateNewPhysicalGridPreserveWalls = originalGrid => {
  let newGrid = [];
  for (let row = 0; row < originalGrid.length; row++) {
    let newRow = [];
    for (let col = 0; col < originalGrid[row].length; col++) {
      let node = originalGrid[row][col];
      newRow.push(
        new GridNodeModel(
          node.col,
          node.row,
          node.id,
          node.isStart,
          node.isFinish,
          Infinity,
          false,
          node.isWall,
          null,
          node.ref
        )
      );
    }
    newGrid.push(newRow);
  }
  return newGrid;
};
