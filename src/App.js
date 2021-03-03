import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwapiService from './swapi-service';

const App = () => {
  const [value, setValue] = useState(1);
  const [visible, setVisible] = useState(true);

  if (visible) {
    return (
      <div>
        <button onClick={() => setValue(value => ++value)}>+</button>
        <button onClick={() => setVisible(false)}>hide</button>
        <HookCounter value={value} />
        <Notification />
        <PlanetInfo id={value} />
      </div>
    );
  } else return <button onClick={() => setVisible(true)}>show</button>;
};

const PlanetInfo = ({ id }) => {
  const swapiService = new SwapiService();
  const [name, setName] = useState(null);

  useEffect(() => {
    let cancelled = false;
    swapiService
      .getPlanet(id)
      .then(planet => !cancelled && setName(planet.name));
    return () => (cancelled = true);
  }, [id]);

  return (
    <div>
      {id} - {name}
    </div>
  );
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

HookCounter.propTypes = {
  value: PropTypes.number.isRequired,
};

PlanetInfo.propTypes = {
  id: PropTypes.number,
};

export default App;
