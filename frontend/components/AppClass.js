import React from "react";
import axios from "axios";

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
    this.state = initialState;
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    let x, y;
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (this.state.index < 3) {
      x = this.state.index + 1;
      y = 1;
    } else if (this.state.index > 2 && this.state.index < 6) {
      x = this.state.index === 3 ? 1 : this.state.index === 4 ? 2 : 3;
      y = 2;
    } else if (this.state.index > 5 && this.state.index < 9) {
      x = this.state.index === 6 ? 1 : this.state.index === 7 ? 2 : 3;
      y = 3;
    }
    return { x, y };
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState);
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    if (direction === "UP") {
      if (this.state.index - 3 >= 0) {
        this.setState({ ...this.state, ["index"]: this.state.index - 3, ["steps"]: this.state.steps + 1, ["message"]: "" });
      } else {
        this.setState({ ...this.state, ["message"]: `You can't go ${direction.toLowerCase()}` });
      }
    } else if (direction === "RIGHT") {
      if (this.state.index === 2 || this.state.index === 5 || this.state.index === 8) {
        this.setState({ ...this.state, ["message"]: `You can't go ${direction.toLowerCase()}` });
        return this.state.index;
      } else {
        this.setState({ ...this.state, ["index"]: this.state.index + 1, ["steps"]: this.state.steps + 1, ["message"]: "" });
      }
    } else if (direction === "DOWN") {
      if (this.state.index + 3 <= 8) {
        this.setState({ ...this.state, ["index"]: this.state.index + 3, ["steps"]: this.state.steps + 1, ["message"]: "" });
      } else {
        this.setState({ ...this.state, ["message"]: `You can't go ${direction.toLowerCase()}` });
      }
    } else if (direction === "LEFT") {
      if (this.state.index === 0 || this.state.index === 3 || this.state.index === 6) {
        this.setState({ ...this.state, ["message"]: `You can't go ${direction.toLowerCase()}` });
        return this.state.index;
      } else {
        this.setState({ ...this.state, ["index"]: this.state.index - 1, ["steps"]: this.state.steps + 1, ["message"]: "" });
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
    const { value } = evt.target;
    this.setState({ ...this.state, ["email"]: value });
  };

  onSubmit = async (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    if (/[^@]+@[^@]/.test(this.state.email) === false && this.state.email !== "") {
      return this.setState({ ...this.state.values, ["message"]: "Ouch: email must be a vaild email" });
    }

    const { x, y } = this.getXY();
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:9000/api/result",
        data: {
          x: x,
          y: y,
          steps: this.state.steps,
          email: this.state.email,
        },
      });
      this.setState({ ...this.state, ["message"]: response.data.message });
    } catch (error) {
      this.setState({ ...this.state, ["message"]: "Ouch: email is required" });
    }
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} time${this.state.steps > 0 && this.state.steps < 2 ? "" : "s"}`}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === this.state.index ? " active" : ""}`}>
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
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
          <button id="reset" onClick={() => this.reset()}>
            reset
          </button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" onChange={(e) => this.onChange(e)}></input>
          <input id="submit" type="submit" onClick={(e) => this.onSubmit(e)}></input>
        </form>
      </div>
    );
  }
}
