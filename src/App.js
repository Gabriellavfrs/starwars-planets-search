import React, { useContext, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import { AppContext } from './context/AppProvider';
import FormFilter from './components/FormFilter';

function App() {
  const { fetchData } = useContext(AppContext);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main>
      <FormFilter />
      <Table />
    </main>
  );
}

export default App;
