
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from "react-router-dom";
import routes from './config/routes';
import { SnackbarProvider } from 'notistack'
import AuthContextProvider from './context/AuthContextProvider';
import { CssBaseline } from '@mui/material';

function App() {

  return (
    <>
      <SnackbarProvider>
        <AuthContextProvider>
        <CssBaseline />
          <RouterProvider router={routes} />
        </AuthContextProvider>
      </SnackbarProvider>
    </>
  )
}

export default App
