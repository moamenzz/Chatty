import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Toaster from "react-hot-toast";
import ProfilePage from "./pages/ProfilePage.jsx";
import Navbar from "./components/Navbar.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import useThemeStore from "../store/useThemeStore.js";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import Layout from "./components/Layout.jsx";

const App = () => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            element={<ProtectedRoutes allowedRoles={[2001, 1984, 5150]} />}
          >
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
