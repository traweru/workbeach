import "./App.css";
import { Route, Routes } from "react-router";
import { MainPage } from "./pages/main";
import { LoginPage } from "./pages/auf/login";
import { RegisterPage } from "./pages/auf/Register";

function App() {
  return (
    <Routes>
      <Route path="/main" Component={MainPage}/>
      <Route path="/" Component={LoginPage}/>
      <Route path="/register" Component={RegisterPage}/>
    </Routes>
  );
}

export default App;
