import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const App = () => {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(true);

  if (visible) {
    return (
      <div>
        <button onClick={() => setValue(value => ++value)}>+</button>
        <button onClick={() => setVisible(false)}>hide</button>
        <ClassCounter value={value} />
        <HookCounter value={value} />
        <Notification />
      </div>
    );
  } else return <button onClick={() => setVisible(true)}>show</button>;
};

const HookCounter = ({ value }) => {
  useEffect(() => {
    console.log('mount');
    return () => console.log('unmount');
  }, []);
  return <p>{value}</p>;
};

const Notification = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const idTimeout = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(idTimeout);
  }, []);

  return <div>{visible && <p>Hello</p>}</div>;
};

class ClassCounter extends Component {
  componentDidMount() {
    console.log('class: mount');
  }
  componentDidUpdate() {
    console.log('class: update');
  }
  componentWillUnmount() {
    console.log('class: unmount');
  }
  render() {
    return <p>{this.props.value}</p>;
  }
}

HookCounter.propTypes = {
  value: PropTypes.number.isRequired,
};

ClassCounter.propTypes = {
  value: PropTypes.number.isRequired,
};

export default App;
