import React from "react";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bIndex: 4,
    };
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    if (direction === "UP") {
      if (this.state.bIndex - 3 >= 0) {
        this.setState({ ...this.state, ["bIndex"]: this.state.bIndex - 3 });
      }
    } else if (direction === "RIGHT") {
      if (this.state.bIndex === 2 || this.state.bIndex === 5 || this.state.bIndex === 8) {
        return this.state.index;
      } else {
        this.setState({ ...this.state, ["bIndex"]: this.state.bIndex + 1 });
      }
    } else if (direction === "DOWN") {
      if (this.state.bIndex + 3 <= 8) {
        this.setState({ ...this.state, ["bIndex"]: this.state.bIndex + 3 });
      }
    } else if (direction === "LEFT") {
      if (this.state.bIndex === 0 || this.state.bIndex === 3 || this.state.bIndex === 6) {
        return this.state.index;
      } else {
        this.setState({ ...this.state, ["bIndex"]: this.state.bIndex - 1 });
      }
    }
  };

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.closest("button").textContent;
    this.getNextIndex(direction);
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === this.state.bIndex ? " active" : ""}`}>
              {idx === this.state.bIndex ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(e) => this.move(e)}>
            LEFT
          </button>
          <button id="up" onClick={(e) => this.move(e)}>
            UP
          </button>
          <button id="right" onClick={(e) => this.move(e)}>
            RIGHT
          </button>
          <button id="down" onClick={(e) => this.move(e)}>
            DOWN
          </button>
          <button id="reset">reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
