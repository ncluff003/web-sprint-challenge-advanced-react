import React, { useState } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [values, setValues] = useState({
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex,
  });

  function getXY() {
    let x, y;
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (values.index < 3) {
      x = values.index + 1;
      y = 1;
    } else if (values.index > 2 && values.index < 6) {
      x = values.index === 3 ? 1 : values.index === 4 ? 2 : 3;
      y = 2;
    } else if (values.index > 5 && values.index < 9) {
      x = values.index === 6 ? 1 : values.index === 7 ? 2 : 3;
      y = 3;
    }
    return { x, y };
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setValues({
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
    });
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "UP") {
      if (values.index - 3 >= 0) {
        setValues({ ...values, ["index"]: values.index - 3, ["steps"]: values.steps + 1, ["message"]: "" });
      } else {
        setValues({ ...values, ["message"]: `You can't go ${direction.toLowerCase()}` });
      }
    } else if (direction === "RIGHT") {
      if (values.index === 2 || values.index === 5 || values.index === 8) {
        setValues({ ...values, ["message"]: `You can't go ${direction.toLowerCase()}` });
        return values.index;
      } else {
        setValues({ ...values, ["index"]: values.index + 1, ["steps"]: values.steps + 1, ["message"]: "" });
      }
    } else if (direction === "DOWN") {
      if (values.index + 3 <= 8) {
        setValues({ ...values, ["index"]: values.index + 3, ["steps"]: values.steps + 1, ["message"]: "" });
      } else {
        setValues({ ...values, ["message"]: `You can't go ${direction.toLowerCase()}` });
      }
    } else if (direction === "LEFT") {
      if (values.index === 0 || values.index === 3 || values.index === 6) {
        setValues({ ...values, ["message"]: `You can't go ${direction.toLowerCase()}` });
        return values.index;
      } else {
        setValues({ ...values, ["index"]: values.index - 1, ["steps"]: values.steps + 1, ["message"]: "" });
      }
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.closest("button").textContent;
    getNextIndex(direction);
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target;
    setValues({ ...values, ["email"]: value });
  }

  async function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    if (/[^@]+@[^@]/.test(values.email) === false && values.email !== "") {
      return setValues({ ...values, ["message"]: "Ouch: email must be a vaild email" });
    }

    const { x, y } = getXY();
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:9000/api/result",
        data: {
          x: x,
          y: y,
          steps: values.steps,
          email: values.email,
        },
      });
      setValues({ ...values, ["message"]: response.data.message });
    } catch (error) {
      setValues({ ...values, ["message"]: "Ouch: email is required" });
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${values.steps} time${values.steps > 0 && values.steps < 2 ? "" : "s"}`}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === values.index ? " active" : ""}`}>
            {idx === values.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{values.message}</h3>
      </div>
      <div id="keypad">
        <button
          id="left"
          onClick={(e) => {
            move(e);
          }}
        >
          LEFT
        </button>
        <button
          id="up"
          onClick={(e) => {
            move(e);
          }}
        >
          UP
        </button>
        <button
          id="right"
          onClick={(e) => {
            move(e);
          }}
        >
          RIGHT
        </button>
        <button
          id="down"
          onClick={(e) => {
            move(e);
          }}
        >
          DOWN
        </button>
        <button id="reset" onClick={() => reset()}>
          reset
        </button>
      </div>
      <form>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={values.email}
          onChange={(e) => {
            onChange(e);
          }}
        ></input>
        <input id="submit" type="submit" onClick={(e) => onSubmit(e)}></input>
      </form>
    </div>
  );
}
