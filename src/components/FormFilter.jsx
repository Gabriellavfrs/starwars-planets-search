import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppProvider';

function FormFilter() {
  const {
    planetsData,
    filteredPlanets,
    setFilterPlanets,
    setInputText,
    setFilterTags,
    filterTags,
  } = useContext(AppContext);

  const [filter, setfilter] = useState(
    { column: 'population', comparison: 'maior que', number: '0' },
  );

  const initialOptions = [
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water'];

  const [options, setOptions] = useState(initialOptions);

  const handleFilter = ({ target }) => {
    const { name, value } = target;
    setfilter((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleIncludeFilter = () => {
    let filtered;
    if (filterTags.length === 0) {
      filtered = planetsData;
      return filtered;
    }
    filterTags.map(({ column, comparison, number }) => {
      // const newOptions = options.filter((option) => option !== column)
      // const xablau = action === 'include' ? filteredPlanets :
      switch (comparison) {
      case ('maior que'):
        filtered = filteredPlanets.filter((tag) => tag[column] > Number(number));
        break;
      case ('menor que'):
        filtered = filteredPlanets.filter((tag) => tag[column] < Number(number));
        break;
      case ('igual a'):
        filtered = filteredPlanets.filter((tag) => tag[column] === Number(number));
        break;
      default:
        filtered = planetsData;
      }
      return filtered;
    });
    setFilterPlanets(filtered);
  };

  const handleDeleteFilter = (tag) => {
    const newFilterTags = filterTags.filter((filterTag) => filterTag !== tag);
    setFilterTags(newFilterTags);
  };

  useEffect(() => {
    console.log(filterTags);
    handleIncludeFilter();
  }, [filterTags]);

  useEffect(() => {
    handleIncludeFilter('delete');
  }, [setFilterTags]);

  return (
    <div>
      <form>
        <input
          data-testid="name-filter"
          type="text"
          placeholder="Filtrar por nome"
          onChange={ ({ target }) => setInputText(target.value) }
        />
        <div>
          <label>
            Coluna
            <select
              data-testid="column-filter"
              name="column"
              onChange={ handleFilter }
            >
              {options.map((option) => (
                <option key={ option } value={ option }>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Operador
            <select
              data-testid="comparison-filter"
              name="comparison"
              onChange={ handleFilter }
            >
              <option value="maior que">maior que</option>
              <option value="menor que">menor que</option>
              <option value="igual a">igual a</option>
            </select>
          </label>
          <input
            type="number"
            name="number"
            data-testid="value-filter"
            onChange={ handleFilter }
          />
          <button
            type="button"
            onClick={ () => setFilterTags([...filterTags, filter]) }
          >
            FILTRAR

          </button>
        </div>
      </form>
      <section>
        { filterTags.length > 0 && (
          filterTags.map((tag, id) => (
            <div key={ id }>
              {`${tag.column} ${tag.comparison} ${tag.number}`}
              <button type="button" onClick={ () => handleDeleteFilter(tag) }>X</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default FormFilter;
