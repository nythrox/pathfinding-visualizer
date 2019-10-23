import React, { createContext } from "react";
import { BehaviorSubject, Subject } from "rxjs";

class AppBloc {
  //------------------streams
  constructor() {
    this.currentAlgorithm$ = new BehaviorSubject(1);
    this.gridValues$ = new Subject();
    this.playAnimation$ = new Subject();
    this.resetBoard$ = new Subject();
    this.gameState$ = new BehaviorSubject(1);

    //------------------enums
    this.CurrentAlgorithmEnum = Object.freeze({
      dijkstra: 1,
      aStar: 2,
      animating: 3
    });
    this.GameStateEnum = Object.freeze({
      idle:1,
      rendering: 2,
      animating: 3
    });
  
}

  dispose() {
    this.currentAlgorithm$.unsubscribe();
    this.playAnimation$.unsubscribe();
    this.resetBoard$.unsubscribe();
    this.gameState$.unsubscribe();
  }
}
export const AppContext = React.createContext(new AppBloc());
