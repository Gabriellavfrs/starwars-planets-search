import { createContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [planetsData, setPlanetsData] = useState([]);
  const [filteredPlanets, setFilterPlanetName] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetch('https://swapi.dev/api/planets/');
      if (!data.ok) {
        const newError = await data.json();
        throw new Error(newError.message);
      }
      const result = await data.json();
      const filteredResult = result.results.map((planet) => {
        delete planet.residents;
        return planet;
      });
      setPlanetsData(filteredResult);
      setFilterPlanetName(filteredResult);
    } catch (e) {
      setError(e);
      throw new Error(e);
    }
  }, []);
  return (
    <AppContext.Provider
      value={ {
        planetsData,
        filteredPlanets,
        setFilterPlanetName,
        error,
        fetchData } }
    >
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppProvider;
