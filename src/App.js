import React, { useContext, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import { AppContext } from './context/AppProvider';

function App() {
  const { fetchData } = useContext(AppContext);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Table />
  );
}

export default App;
