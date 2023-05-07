import React, { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { errorMessage, planetsData } from './mocks';
import App from '../App';
import AppProvider, { AppContext } from '../context/AppProvider';
import userEvent from '@testing-library/user-event';

describe('<AppProvider />', () => {
  it('Testa se o fetch é realizado', async () => {

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => (planetsData),
    });

    render(<AppProvider><App /></AppProvider>);
    expect(fetch).toBeCalled;

    const planetsCellsEl = await screen.findAllByTestId('planet-name');
    expect(planetsCellsEl).toHaveLength(10);
  });

  it('Testa se é retornado erro durante falha', async () => {

    jest.spyOn(global, 'fetch').mockRejectedValue({
      message: errorMessage,
    });

  render(<AppProvider><App /></AppProvider>);
  expect(fetch).toBeCalled;

  const error = await screen.findByText('404')
  expect(error).toBeInTheDocument();
  });
});

describe('<FormFilter />', () => {
  it('Testa se os elementos de filtro são renderizados no componene', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => (planetsData),
    });
    
    render(<AppProvider><App /></AppProvider>);

    const textInputEl = await screen.findByRole('textbox');
    const hothCell = await screen.findByRole('cell', {
      name: /hoth/i
    });
    const tatooineCell = await screen.findByRole('cell', {
      name: /tatooine/i
    });

    userEvent.type(textInputEl, 'H');
    expect(hothCell).toBeInTheDocument();
    expect(tatooineCell).not.toBeInTheDocument();
  });

    it('Testa se o filtro é aplicado aos elementos', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: async () => (planetsData),
      });
      
      render(<AppProvider><App /></AppProvider>);

      const hothCell = await screen.findByRole('cell', {
        name: /hoth/i
      });
      const tatooineCell = await screen.findByRole('cell', {
        name: /tatooine/i
      });

      const colunaSelectEl = screen.getByTestId('column-filter');
      userEvent.selectOptions(colunaSelectEl, 'orbital_period');
  
      const operadorSelectEl = screen.getByTestId('comparison-filter');
      userEvent.selectOptions(operadorSelectEl, 'maior que');
      
      const numberInputEl = screen.getByTestId('value-filter');
      userEvent.type(numberInputEl, '400');

      const filterBtnEl = screen.getByTestId('button-filter');
      userEvent.click(filterBtnEl);

      const filterTag = await screen.findByTestId('filter');
      expect(filterTag).toBeInTheDocument();

      // const planetsCellsEl = await screen.findAllByRole('row');
      // expect(planetsCellsEl).toHaveLength(10);

      expect(tatooineCell).not.toBeInTheDocument();
      expect(hothCell).toBeInTheDocument();
    });

    it('Testa se o filtro é pode ser removido', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: async () => (planetsData),
      });
      
      render(<AppProvider><App /></AppProvider>);

      const colunaSelectEl = screen.getByTestId('column-filter');
      userEvent.selectOptions(colunaSelectEl, 'orbital_period');
  
      const operadorSelectEl = screen.getByTestId('comparison-filter');
      userEvent.selectOptions(operadorSelectEl, 'maior que');
      
      const numberInputEl = screen.getByTestId('value-filter');
      userEvent.type(numberInputEl, '400');

      const filterBtnEl = screen.getByTestId('button-filter');
      userEvent.click(filterBtnEl);

      const deleteFilterBtn = await screen.findByRole('button', {
        name: /x/i
      })
      expect(deleteFilterBtn).toBeInTheDocument();
      userEvent.click(deleteFilterBtn);

      const alderaanCell = await screen.findByRole('cell', {
        name: /Alderaan/i
      });
      const tatooineCell = await screen.findByRole('cell', {
        name: /tatooine/i
      });

      expect(tatooineCell).toBeInTheDocument();
      expect(alderaanCell).toBeInTheDocument();
    });

    it('Testa se múltiplos filtros são aplicados', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: async () => (planetsData),
      });
      
      render(<AppProvider><App /></AppProvider>);

      const hothCell = await screen.findByRole('cell', {
        name: /hoth/i
      });
      const tatooineCell = await screen.findByRole('cell', {
        name: /tatooine/i
      });
      const bespinCell = await screen.findByRole('cell', {
        name: /Bespin/i
      });
      const endorCell = await screen.findByRole('cell', {
        name: /Endor/i
      });
      const colunaSelectEl = screen.getByTestId('column-filter');
      userEvent.selectOptions(colunaSelectEl, 'orbital_period');
  
      const operadorSelectEl = screen.getByTestId('comparison-filter');
      userEvent.selectOptions(operadorSelectEl, 'maior que');
      
      const numberInputEl = screen.getByTestId('value-filter');
      userEvent.type(numberInputEl, '400');

      const filterBtnEl = screen.getByTestId('button-filter');
      userEvent.click(filterBtnEl);

      userEvent.selectOptions(colunaSelectEl, 'rotation_period');
      userEvent.selectOptions(operadorSelectEl, 'menor que');
      userEvent.type(numberInputEl, '19');
      userEvent.click(filterBtnEl);

      userEvent.selectOptions(colunaSelectEl, 'surface_water');
      userEvent.selectOptions(operadorSelectEl, 'igual a');
      userEvent.type(numberInputEl, '8');
      userEvent.click(filterBtnEl);
    

      const filterTags = await screen.findAllByTestId('filter');
      expect(filterTags).toHaveLength(3);

      expect(tatooineCell).not.toBeInTheDocument();
      expect(hothCell).not.toBeInTheDocument();
      expect(bespinCell).not.toBeInTheDocument();
      expect(endorCell).toBeInTheDocument();

    });

    it('Testa se múltiplos filtros são removidos ao clicar no botão "remover filtros', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: async () => (planetsData),
      });
      
      render(<AppProvider><App /></AppProvider>);

      const colunaSelectEl = screen.getByTestId('column-filter');
      userEvent.selectOptions(colunaSelectEl, 'orbital_period');
  
      const operadorSelectEl = screen.getByTestId('comparison-filter');
      userEvent.selectOptions(operadorSelectEl, 'maior que');
      
      const numberInputEl = screen.getByTestId('value-filter');
      userEvent.type(numberInputEl, '400');

      const filterBtnEl = screen.getByTestId('button-filter');
      userEvent.click(filterBtnEl);

      userEvent.selectOptions(colunaSelectEl, 'rotation_period');
      userEvent.selectOptions(operadorSelectEl, 'igual a');
      userEvent.type(numberInputEl, '18');
      userEvent.click(filterBtnEl);
    

      const filterTags = await screen.findAllByTestId('filter');
      expect(filterTags).toHaveLength(2);

      const removeFilterBtn = await screen.findByTestId('button-remove-filters');

      userEvent.click(removeFilterBtn);

      const filterTags2 = screen.queryAllByTestId('filter');
      expect(filterTags2).toHaveLength(0);
    });

    it('Testa se os elementos são ordenados conforme selecionado "ascentende" / "descendente"', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: async () => (planetsData),
      });
      
      render(<AppProvider><App /></AppProvider>);

      const planetsCellsEl = await screen.findAllByTestId('planet-name');
      expect(planetsCellsEl[0].innerHTML).toBe('Tatooine');

      const orderSelectEl = screen.getByTestId('column-sort');
    
      const ascRadioEl = screen.getByTestId('column-sort-input-asc');

      const descRadioEl = screen.getByTestId('column-sort-input-desc');
      
      const orderBtnEl = screen.getByTestId('column-sort-button');

      userEvent.selectOptions(orderSelectEl, 'population');
      userEvent.click(ascRadioEl);
      userEvent.click(orderBtnEl);
      
      const planetsCellsEl2 = await screen.findAllByTestId('planet-name');
      expect(planetsCellsEl2[0].innerHTML).toBe('Yavin IV');

      userEvent.selectOptions(orderSelectEl, 'orbital_period');
      userEvent.click(descRadioEl);
      userEvent.click(orderBtnEl);

      const planetsCellsEl3 = await screen.findAllByTestId('planet-name');
      expect(planetsCellsEl3[0].innerHTML).toBe('Bespin')
    });
});