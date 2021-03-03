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
      </div>
    );
  } else return <button onClick={() => setVisible(true)}>show</button>;
};

const HookCounter = ({ value }) => {
  // useEffect регистриует функцию, которая запускается каждый раз, когда обновляется определенный набор данных
  useEffect(() => {
    // запускается когда компонент mounted или updated
    console.log('start/update useEffect');
    // если вернуть функцию, она будет запускаться для очистки предыдущего эффекта
    // запускается, когда компонент unmounted или updated (очистка перед новым запуском)
    return () => console.log('clear useEffect');
    // [...] - массив переменных, на изменение которых подписана функция, если массив пустой,
    // ведет себя как componentDidMont
  }, [value]);
  return <p>{value}</p>;
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
