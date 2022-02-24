import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Voter from "./components/Voter";
import Admin from "./components/Admin";
import PoliticalParties from "./components/PoliticalParty";
import Party from "./components/PoliticalParty/Party";
import NotFound from "./components/NotFound";
import { AdminProvider } from "./context/AdminContext";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/voter" element={<Voter />} />
        <Route
          exact
          path="/admin"
          element={
            <AdminProvider>
              <Admin />
            </AdminProvider>
          }
        />
        <Route
          exact
          path="/participating-parties"
          element={<PoliticalParties />}
        />
        <Route exact path="/party/:id" element={<Party />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
