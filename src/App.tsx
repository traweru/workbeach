import styled from "styled-components";
import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router";
import { MainPage } from "./pages/main";
import { LoginPage } from "./pages/auf/login";
import { RegisterPage } from "./pages/auf/Register";

function App() {
  return (
    <Routes>
      <Route path="/main" Component={MainPage}/>
      <Route path="/login" Component={LoginPage}/>
      <Route path="/register" Component={RegisterPage}/>
    </Routes>
  );
}

export default App;
