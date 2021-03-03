import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import SwapiService from './swapi-service';

const swapiService = new SwapiService();

const App = () => {
  const [value, setValue] = useState(1);
  const [visible, setVisible] = useState(true);

  if (visible) {
    return (
      <div>
        <Notification />
        <button onClick={() => setValue(value => ++value)}>+</button>
        <button onClick={() => setVisible(false)}>hide component</button>
        <HookCounter value={value} />
        <PlanetInfo planetId={value} />
      </div>
    );
  } else {
    return <button onClick={() => setVisible(true)}>show component</button>;
  }
};

// функция возвращает асинхронную функцию
const getPlanet = async id => swapiService.getPlanet(id);

// хук получает данные из любой асинхронной функции и инкапсулирует lifecycle и логику обовления state
// это хороший паттерн для разделения обязанностей
const useRequest = request => {
  // хук useMemo() кэширует initialState в рамках хука useRequest(),
  // чтобы переменную можно было использовать без необходиомсти добавлять ее в зависимости хука [] useRequest()
  // без useMemo() объект initialState будет создаваться каждый раз при вызове хука useRequest(), что повлечет за собой
  // вызов useEffect(), что приведет к бесконечному циклу запросов на сервер
  const initialState = useMemo(() => ({
    data: null,
    loading: true,
    error: false,
  }));

  const [dataState, setDataState] = useState(initialState);

  useEffect(() => {
    // сбрасываем state в initial state при component mount/update
    setDataState(initialState);

    let cancelled = false;

    request()
      .then(
        data =>
          !cancelled && setDataState({ data, loading: false, error: false })
      )
      .catch(
        error =>
          !cancelled && setDataState({ data: null, loading: false, error })
      );

    return () => (cancelled = true);
  }, [request]);

  return dataState;
};

// хук делает запрос к серверу, когда id планеты обновилось и возвращает state, lifecycle и данные планеты
const usePlanetInfo = planetId => {
  // useCallback(() => ...) - запускает колбэк-функцию только тогда, когда обновится id планеты, переданный в хук
  // этот паттерн нужен, когда хуки зависят от функций, в данном случае usePlanetInfo() зависит от getPlanet()
  // без использования useCallback() приложение будет постоянно генерировать запросы на сервер
  const request = useCallback(() => getPlanet(planetId), [planetId]);
  return useRequest(request);
};

// получаем название планеты и обновляем компонент
const PlanetInfo = ({ planetId }) => {
  const { data, loading, error } = usePlanetInfo(planetId);

  if (error) return <div>Something has wrong!</div>;

  if (loading) return <div>loading...</div>;

  return (
    <div>
      {planetId} - {data && data.name}
    </div>
  );
};

// счетчик для демонстрации работы хука useEffect()
const HookCounter = ({ value }) => {
  useEffect(() => {
    console.log('mount/update'); // аналогично componentDidMount()
    return () => console.log('unmount'); // аналогично componentWillUnmount()
    // пустой [] означает, что функции в внутри useEffect() будут вызываться только один раз
    // т.е функция в return только при удалении компонента из DOM аналогично componentWillUnmount(),
    // а все остальное аналогично componentDidMount()
    // в случае отсутствия [], все функции внутри useEffect()
    // будут срабатывать при любом обновлении компонента (при получении props при рендеринге)
  });

  return <p>{value}</p>;
};

// приветствие для демонстрации работы хука useEffect()
const Notification = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // приветствие исчезает через 3.5 секунды
    const idTimeout = setTimeout(() => setVisible(false), 3500);
    // удаляем таймаут для освобождения памяти
    return () => clearTimeout(idTimeout);
  }, []);

  return <div>{visible && <p>Hello</p>}</div>;
};

HookCounter.propTypes = {
  value: PropTypes.number.isRequired,
};

PlanetInfo.propTypes = {
  planetId: PropTypes.number.isRequired,
};

export default App;
