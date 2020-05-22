import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({});

class Signup extends React.Component {
  constructor() {
    super();
  }

  componentWillUnmount() {}
  componentDidUpdate(nextProps, nextState) {}
  render() {
    return (
      <div>
        <form>
          <div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <div>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                autoComplete="off"
              />
            </div>
          </div>
          <button type="submit">Signin</button>
        </form>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
