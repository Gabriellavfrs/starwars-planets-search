import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [planetsData, setPlanetsData] = useState([]);
  const [filteredPlanets, setFilterPlanets] = useState([]);
  const [errorMessage, setErrorMesage] = useState(null);
  const [inputText, setInputText] = useState('');
  const [filterTags, setFilterTags] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetch('https://swapi.dev/api/planets/');
      const result = await data.json();
      const filteredResult = result.results.map((planet) => {
        delete planet.residents;
        return planet;
      });
      setPlanetsData(filteredResult);
      setFilterPlanets(filteredResult);
    } catch (error) {
      setErrorMesage(error.message);
    }
  }, []);

  useEffect(() => {
    // console.log('entrei');
    fetchData();
  }, [fetchData]);

  const values = useMemo(() => ({
    planetsData,
    filteredPlanets,
    setFilterPlanets,
    errorMessage,
    inputText,
    setInputText,
    filterTags,
    setFilterTags,
  }), [planetsData, filteredPlanets, errorMessage, inputText, filterTags, setFilterTags]);

  return (
    <AppContext.Provider
      value={ values }
    >
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppProvider;
