import React from "react";
import {
  Text,
} from "react-native";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: Number(this.props.initial),
    };

    this.intervalRef = React.createRef();
  }

  componentDidMount() {
    this.intervalRef.current = setInterval(() => {
      if (this.state.value > 0) {
        if (this.state.value == 3) {
          this.props.changeImg();
        }
        this.setState((prevState) => ({
          value: prevState.value - 1,
        }));
      } else {
        this.stopTimer();
        this.props.close();
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  stopTimer = () => {
    clearInterval(this.intervalRef.current);
  };

  render() {
    return <Text>跳过 {this.state.value}s</Text>;
  }
}

export default Timer;
