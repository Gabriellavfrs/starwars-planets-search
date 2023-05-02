import React, { useContext } from 'react';
import { AppContext } from '../context/AppProvider';

function FormFilter() {
  const { planetsData, setFilterPlanetName } = useContext(AppContext);
  // const [filteredNames, setFilterNames] = useState([]);

  const handleChange = ({ target }) => {
    const newPlanets = planetsData.filter(({ name }) => name.includes(target.value));
    setFilterPlanetName(newPlanets);
  };

  return (
    <form>
      <input
        data-testid="name-filter"
        type="text"
        name=""
        placeholder="Filtrar por nome"
        onChange={ handleChange }
      />
    </form>
  );
}

export default FormFilter;
