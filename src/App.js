import React, { Component } from 'react';
import logo from './logo.svg';
import AsyncDataComponent from './AsyncDataComponent';
import './App.css';

class App extends Component {
  state = {
    isOpen: false,
  }

  handleToggleOpen = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen
    }))
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" width={200} />
          <button onClick={this.handleToggleOpen}>Toggle</button>
          {isOpen && (
            <AsyncDataComponent />
          )}
        </header>
      </div>
    );
  }
}

export default App;
