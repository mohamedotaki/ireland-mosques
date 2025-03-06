import React from 'react';
import logo from './logo.svg';
import './App.css';
import BottomNavigationBar from './navigation/BottomNavigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme();


function App() {
  return (
    <div className="App">
          <ThemeProvider theme={theme}>

      <BottomNavigationBar/>
      </ThemeProvider>


    </div>
  );
}

export default App;
