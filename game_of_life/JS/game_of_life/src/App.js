import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import {arches} from './Presets/arches';
import { kirby } from './Presets/kirby';
import { logo } from './Presets/switch_logo';

function App() {
  
  const [dot, setDot] = useState(true);
  const [generations, setGenerations] = useState(0);
  
  const generateEmptyGrid = () =>{
    const rows = [];
      for (let i = 0; i < gridRows; i++){
        rows.push(Array.from(Array(gridCols), () => 0));
      }
      return rows;
  }

  const gridRows = 25;
  const gridCols = 25;
  
  const neighborOp = [
    [0,-1],
    [-1,0],
    [-1,-1],
    [1,0],
    [1,-1],
    [-1,1],
    [1,-1],
    [1,0]
  ]
  const [grid, setGrid] = useState(() =>{
    return generateEmptyGrid();
  });
  
  const [process, setProcess] = useState(false);
  
  const simRef = useRef(process);
  simRef.current = process;
  
  const simulation = useCallback(() =>{
    
    if (!simRef.current){
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) =>{
        for(let i = 0; i < gridRows; i ++){
          for (let k = 0; k < gridCols; k ++){
            let neighbors = 0;
            neighborOp.forEach(([x,y]) =>{
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < gridRows && newK >= 0 && newK < gridCols){
                neighbors += g[newI][newK]
              }
            })
            if (neighbors < 2 || neighbors > 3){
              gridCopy[i][k] = 0;
            }
            else if (g[i][k] === 0 && neighbors === 3){
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    })
    setTimeout(simulation, (document.getElementById("speed").value * 1000));
  }, [])
  // for(let i = 0; i < 5; i++){
  //   setGenerations(() => {
  //     console.log(generations);
  //     return generations+1})
  //   console.log(generations);
  // }
    
  return (
    <>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => 
            <button
            disabled = {!dot}
            key = { `${i}-${k}`}
            onClick={() =>{
              // if(process === false){
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1 ;
                })
                setGrid(newGrid);
                console.log(grid); 
              // }
            }}
            style={{width: 20, height: 20,
            backgroundColor: grid[i][k] ? "yellow" : undefined, border: "solid 1px black"}}
            />
          ))
        }
    </div>
    
    <div>
      GENERATION: {generations}
    </div>

    <div>
    <input type="number" id="speed" placeholder="enter speed per generation (in Seconds)"/>
    
    <button onClick={() =>{
      setProcess(!process);
      if (!process){
        simRef.current = true;
        simulation()
        // generationSim()
      }
        setDot(true)
    }}>
      stop
    </button>

    <button onClick={() =>{
      setProcess(!process);
      if (!process){
        simRef.current = true;
        simulation()
        // generationSim()
        }
        setDot(false)
    }}>
      RUN
    </button>

    <button onClick={() => {
      setGrid(generateEmptyGrid());
      }}>
      clear
    </button>

    <button onClick={() => {
      const rows = [];
      for (let i = 0; i < gridRows; i ++){
        rows.push(Array.from(Array(gridCols), () => Math.random() > 0.7 ? 1 : 0))
        }
      setGrid(rows);
      }}>
      random
    </button>
    </div>

    <div>
      Presets:
      <button
      onClick = {() => {
        const rows = arches;
        setGrid(rows);}}>
        arches
      </button>

      <button 
      onClick = {() =>{
        const rows = kirby;
        setGrid(rows);
      }}>
        kirby
      </button>

      <button
      onClick = {() =>{
        const rows = logo;
        setGrid(rows);
      }}>
        Switch Logo
      </button>
    </div>
    
    <section>
      <p>Setting up Game of Life Simulation: </p>
      <p>
        1. Choose from either one of the presets, a randomly generated grid, or individually populate each cell
      </p>
      <p>
        2. set the speed of each generation per second (defaults to 0 to process generations quickly)
      </p>
      <p>
        3. Click the "RUN" button to start the simulation
      </p>
      <p>
        4. Click the "stop" button to stop the simulation
      </p>

      <p>
        Rules for the Game of Life:
      </p>
      <p>
        1. as the simulation is running, you cannot populate any cells. Only when the simulation has stopped
      </p>
      <p>
        2. Each living cell will die either due to solitude (having one or less living neighbors) or overpopulation (having four or more living neighbors). 
        <br/>
        Otherwise, it will stay alive.
      </p>
      <p>
        3. A dead cell can become populated IF it has only THREE living neighbors.
      </p>

    </section>

    </>
  );
}

export default App;
