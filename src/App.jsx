import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./components/Login.jsx";
import Logout from "./components/logout.jsx";
import Home from "./Home";
import "./scss/styles.scss";
import Deltager from "./Deltager.jsx";
import RoleChecker from "./components/RoleChecker.jsx";
import AdminPanel from "./components/adminPanel.jsx";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deltager/:id" element={<Deltager />} />
        <Route path="*" element={<h2>Not Found</h2>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/admin"
          element={
            <RoleChecker roles={["ADMIN"]}>
              <AdminPanel />
            </RoleChecker>
          }
        />
      </Routes>
    </Layout>
  );
}
