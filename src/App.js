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

  _handleChange(e) {
    if(!e.target.value) return;
    const count = parseInt(e.target.value, 10) || 1;
    this.puzzles = this._puzzles(count);
    this.setState({
      [e.target.name]: count,
      activeDrag: null
    })
  }

  _handlePuzzleCount(e) {
    e.preventDefault();
    console.log(e.target.name)
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
    console.log(e.target.id);
    if(dragOver !== null) {
      this.clearDrggingState();
    }
    // e.dataTransfer.setData("text", e.target.id);

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
      this.clearDrggingState()
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
    const { count } = this.state;
    return (
      <div className="app">
        <h1>Welcome to Puzzle Game</h1>
        <h3>Change Puzzle Size</h3>
        <div className="form-item">
          <input
            type="text"
            name="count"
            pattern="[0-9]*"
            onChange={this.handleChange}
            // value={`${count}`}
          />
        </div>
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
