import React, { useState, useEffect, useImperativeHandle, useRef } from "react";

const GridNode = props => {
  let id = props.id;
  const [isStart, setIsStart] = useState(props.isStart);
  const [isWall, setIsWall] = useState(props.isWall);
  const [isFinish, setIsFinish] = useState(props.isFinish);

  const handleMouseEnter = () => {
    if (window.canDrag) {
      if (window.isDragging) {
        if (window.target === "start") {
          props.toggleStart(props.col, props.row);
          setIsStart(true);
        } else {
          props.toggleFinish(props.col, props.row);
          setIsFinish(true);
        }
      } else {
        if (window.isMouseDown && window.canEdit) {
          toggleActive();
        }
      }
    }
  };

  const handleClick = () => {
    if (window.canEdit) toggleActive();
  };

  const toggleActive = () => {
    props.toggleActive(props.col, props.row);
    if (window.tool === "addWall") {
      setIsWall(true);
    } else {
      setIsWall(false);
    }
  };

  // function getRndInteger(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1) ) + min;
  // }

  let classes = "grid-node";
  if (isStart) classes += " start";
  if (isFinish) classes += " finish";
  // if (isWall) classes += " wall-"+getRndInteger(1,3)
  if (isWall) classes += " wall";
  let ids = `node-${props.row}-${props.col}`;

  let ref = useRef(null);

  useEffect(() => {
    setIsWall(props.isWall);
    setIsStart(props.isStart);
    setIsFinish(props.isFinish);
    props.addRefToList(props.col, props.row, ref);
    const element = document.getElementById(`node-${props.row}-${props.col}`);
    element.classList.remove("visited");
    element.classList.remove("shortest-path");
    element.classList.remove("current-visited");
  }, [setIsFinish, setIsStart, setIsWall, props]);

  const handleMouseDownDrag = () => {
    if (window.canDrag) {
      window.isDragging = true;
      if (isStart) window.target = "start";
      else window.target = "finish";
    }
  };

  const handleMouseLeaveDrag = () => {
    if (window.canDrag) {
      if (window.isDragging) {
        if (isStart) {
          props.toggleStart(props.col, props.row);
          setIsStart(false);
        } else {
          props.toggleFinish(props.col, props.row);
          setIsFinish(false);
        }
      }
    }
  };
  return (
    <div
      ref={ref}
      className={classes}
      id={ids}
      onMouseLeave={isStart || isFinish ? handleMouseLeaveDrag : null}
      onMouseDown={isStart || isFinish ? handleMouseDownDrag : null}
      onClick={!(isStart || isFinish) ? handleClick : null}
      onMouseEnter={!(isStart || isFinish) ? handleMouseEnter : null}
    ></div>
  );
};

export default GridNode;
