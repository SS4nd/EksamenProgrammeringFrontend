import React from "react";
import NavHeader from "./NavHeader";
import "./layout.css";
import { version } from "../package.json";
const Layout = ({ children }) => {
  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <header className="nav-header">
        <NavHeader />
      </header>
      <main className="page-content flex-grow-1">{children}</main>
      <footer className="footer text-center mt-auto">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <p style={{ color: "white" }}></p>
            </div>
            <div className="col-md-auto">
              <p style={{ color: "white" }}>Release v{version}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
