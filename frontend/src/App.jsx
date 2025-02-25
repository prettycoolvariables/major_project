import './App.css';
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} /> 
              <Route path="/installation" element={<Installations />} /> 
              <Route path="/history" element={<History />} />
              <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
      </Router>
  );
}

export default App;
