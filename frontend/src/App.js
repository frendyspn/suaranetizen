import React from 'react';
import AppRoutes from './routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SettingProvider } from "./contexts/SettingContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
    
    return (
    <>

<AuthProvider>
<SettingProvider>
      <AppRoutes />
      <ToastContainer />

</SettingProvider>
</AuthProvider>
    </>
  );
}

export default App;
