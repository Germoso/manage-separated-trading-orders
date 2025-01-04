import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import RegisterPage from '@/pages/register';
import Operations from './pages/operations';
import { CreatePositionModalProvider } from './context/CreatePositionModalContext';
import DefaultLayout from './layouts/default';
import LoginPage from './pages/login';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <CreatePositionModalProvider>
      <AuthProvider>
        <Routes>
          <Route element={<IndexPage />} path="/" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<LoginPage />} path="/login" />
          <Route
            element={
              <DefaultLayout>
                <Operations />
              </DefaultLayout>
            }
            path="/operations"
          />
        </Routes>
      </AuthProvider>
    </CreatePositionModalProvider>

  );
}

export default App;
