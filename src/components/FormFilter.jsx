import React, { useContext, useEffect, useMemo, useState } from 'react';
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

  const initialOptions = useMemo(() => [
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water'], []);

  const [options, setOptions] = useState(initialOptions);

  const [filter, setfilter] = useState(
    { column: 'population', comparison: 'maior que', number: '0' },
  );

  const [orderFilter, setOrderFilter] = useState(
    { column: 'population', sort: '' },
  );

  const handleFilterTag = ({ target }) => {
    // console.log(filter);
    const { name, value } = target;
    setfilter((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFilter = () => {
    // console.log(filter);
    let filtered;
    if (filterTags.length === 0) {
      setfilter({ ...filter, column: initialOptions[0], number: '0' });
      filtered = planetsData;
      return filtered;
    }
    filterTags.map(({ column, comparison, number }) => {
      const newOptions = options.filter((option) => option !== column);
      setOptions(newOptions);
      setfilter({ ...filter, column: newOptions[0], number: '0' });
      switch (comparison) {
      case ('maior que'):
        filtered = filteredPlanets.filter((tag) => Number(tag[column]) > Number(number));
        break;
      case ('menor que'):
        filtered = filteredPlanets.filter((tag) => Number(tag[column]) < Number(number));
        break;
      default:
        filtered = filteredPlanets
          .filter((tag) => Number(tag[column]) === Number(number));
      }
      return filtered;
    });
    setFilterPlanets(filtered);
  };

  const handleClick = () => {
    setFilterTags([...filterTags, filter]);
  };

  const handleOrder = ({ target }) => {
    const { name, value } = target;
    setOrderFilter((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOrderData = () => {
    const { column, sort } = orderFilter;
    const validData = filteredPlanets
      .filter((planet) => planet[column] !== 'unknown');
    const invalidData = filteredPlanets
      .filter((planet) => planet[column] === 'unknown');
    const orderedValidData = validData
      .sort((a, b) => (sort === 'ASC'
        ? Number(a[column]) - Number(b[column])
        : Number(b[column]) - Number(a[column])));
    setFilterPlanets([...orderedValidData, ...invalidData]);
  };

  useEffect(() => {
    handleFilter();
  }, [filterTags]);

  const handleDeleteFilter = (tag) => {
    const newFilterTags = filterTags.filter((filterTag) => filterTag !== tag);
    setFilterTags(newFilterTags);
    setFilterPlanets(planetsData);
    setOptions(initialOptions);
  };

  const removeAllFilters = () => {
    setFilterTags([]);
    setFilterPlanets(planetsData);
    setOptions(initialOptions);
  };

  return (
    <div>
      <form>
        <input
          data-testid="name-filter"
          type="text"
          placeholder="Filtrar por nome"
          onChange={ ({ target }) => setInputText(target.value) }
        />
        <label>
          Coluna
          <select
            data-testid="column-filter"
            name="column"
            onChange={ handleFilterTag }
            value={ options[0] }
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
            onChange={ handleFilterTag }
          >
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
        </label>
        <input
          type="number"
          name="number"
          value={ filter.number }
          data-testid="value-filter"
          onChange={ handleFilterTag }
        />
        <button
          type="button"
          data-testid="button-filter"
          onClick={ handleClick }
        >
          FILTRAR

        </button>
        <div>
          <label>
            Ordenar
            <select
              data-testid="column-sort"
              name="column"
              onChange={ handleOrder }
            >
              {initialOptions.map((option) => (
                <option key={ option } value={ option }>{option}</option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="ASC"
              data-testid="column-sort-input-asc"
              onChange={ handleOrder }
            />
            Ascendente
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="DESC"
              data-testid="column-sort-input-desc"
              onChange={ handleOrder }
            />
            Descendente
          </label>
        </div>
        <button
          type="button"
          data-testid="column-sort-button"
          onClick={ handleOrderData }
        >
          ORDENAR

        </button>
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ removeAllFilters }
        >
          REMOVER FILTROS

        </button>
      </form>
      <section>
        { filterTags.length > 0 && (
          filterTags.map((tag, id) => (
            <div key={ id } data-testid="filter">
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
