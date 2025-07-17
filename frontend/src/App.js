import React from 'react';
import AppRoutes from './routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SettingProvider } from "./contexts/SettingContext";

function App() {
    
    return (
    <>

<SettingProvider>
      <AppRoutes />
      <ToastContainer />

</SettingProvider>
    </>
  );
}

export default App;
