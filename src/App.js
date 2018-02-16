import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 3,
      activeDrag: null,
      dragOver: null
    }
    this.puzzles = this._puzzles(3);
    this.handlePuzzleCount = this._handlePuzzleCount.bind(this)
    this.handleChange = this._handleChange.bind(this)
    this.onDragStart = this._onDragStart.bind(this)
    this.onDrop = this._onDrop.bind(this)
    this.onDragOver = this._onDragOver.bind(this)
    this.onDragEnd = this._onDragEnd.bind(this)
  }

  shuffle(arr) {
    let ctr = arr.length, temp, index;
    // While there are elements in the array
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = arr[ctr];
      arr[ctr] = arr[index];
      arr[index] = temp;
    }
    return arr;
  }

  isSorted(arr) {
    for (let k = 0; k < arr.length; k++){
      if (arr[k] > arr[k + 1]) {
        return false;
      }
    }
    return true;

  }
  _handleChange(e) {
    if(!e.target.value || !parseInt(e.target.value, 10)) return;
    const count = parseInt(e.target.value, 10) || 1;
    this.puzzles = this._puzzles(count);
    this.setState({
      [e.target.name]: count,
      activeDrag: null
    })
  }

  _handlePuzzleCount(e) {
    e.preventDefault();
  }

  _onDragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
    this.setState({
      activeDrag: e.target.id
    })
  }
  _onDragEnd(e) {
    e.preventDefault();
    const { dragOver } = this.state;
    if(dragOver !== null) {
      this.clearDrggingState();
    }
  }
  _onDragOver(e) {
    e.preventDefault();
    const { dragOver } = this.state;
    const id = e.target.id
    if(!id ||  id === dragOver) return;
    this.setState(prev => ({
      dragOver: prev.activeDrag !== id ? id : null
    }))
  }

  _onDrop(e) {
    e.preventDefault();
    const { activeDrag } = this.state;
    let data = e.dataTransfer.getData("text");
    const id = e.target.id;
    if(!id || id === activeDrag) {
      this.clearDrggingState();
      return;
    }
    let item1 = parseInt(data.split('-')[1], 10);
    item1 = this.puzzles.indexOf(item1);
    let item2 = parseInt(id.split('-')[1], 10);
    item2 =  this.puzzles.indexOf(item2);
    const temp = this.puzzles[item1];
    this.puzzles[item1] = this.puzzles[item2]
    this.puzzles[item2] = temp;
    this.clearDrggingState()
  }

  clearDrggingState() {
    this.setState({
      activeDrag: null,
      dragOver: null
    })
  }

  _puzzles(count) {
    if(!count) return;
    const size = count * count;
    const arr = new Array(size).fill(undefined).map((val,idx) => idx);
    return this.shuffle(arr)
  }

  _renderPuzzles() {
    const { count, activeDrag, dragOver } = this.state;
    return this.puzzles.map(i => {
      const k = `item-${i}`;
      const onDrag = k === activeDrag ? 'on-drag':'';
      const onOver = k === dragOver ? 'on-over': '';
      const margin = 2;
      return (
        <div
          className={`item ${onDrag} ${onOver}`}
          id={k}
          key={k}
          style={{
            margin: `${margin}px`,
            flexBasis: `calc(${(100/count)}% - ${margin*2}px)`
          }}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
          draggable={true}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          <div>
            {i}
          </div>
        </div>
      )
    })
  }

  render() {
    const isSorted = this.isSorted(this.puzzles);
    return (
      <div className="app">
        <h1>Welcome to Puzzle Game</h1>
        <h3>Change Puzzle Size</h3>
        <div className="form-item">
          <input
            placeholder="Change Puzzle Size."
            type="text"
            name="count"
            pattern="[0-9]*"
            onChange={this.handleChange}
            // value={`${count}`}
          />
        </div>
        {isSorted &&
        <div className="alert">
         <h3>Great Work! You have Successfully rearranged ths puzzle</h3>
        </div>}
        <div className="puzzle-container">
          <div className="row">
            { this._renderPuzzles() }
          </div>

        </div>
      </div>
    );
  }
}

export default App;
