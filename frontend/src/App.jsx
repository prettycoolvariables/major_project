import "./App.css";
import { useEffect, useState } from "react";
import Modal from "./components/modalcontext";
import Login from "./components/login/login";
import Install from "./components/install/install";
import Dashboard from "./components/dashboard/dashboard";
import History from "./components/history/history";
import { Route, Routes} from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [acci, setAcci] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

async function accidentalert() {
  const fetched = await fetch("http://127.0.0.1:5000/receive");
    // const datafetched = await fetched.json()
    const crashes = await fetched.json();
    // console.log("kittio",crashes)
    setData(crashes);
}


  async function getallcrashes() {
    const fetched = await fetch("http://127.0.0.1:5000/get_all");
    // const datafetched = await fetched.json()
    const crashes = await fetched.json();
    // console.log("kittio",crashes)
    setData(crashes);
  }

  useEffect(() => {
    getallcrashes();
  }, []);



  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
<div>
          {/* Button to open the modal */}
          <button onClick={openModal}>Open Modal</button>

          {/* Persistent Modal */}
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2>This is a persistent modal!</h2>
            <p>It stays open even when you switch pages.</p>
          </Modal>


    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/installations" element={<Install />} />
      <Route path="/history" element={<History data={data} />} />
    </Routes>
    </div>
  );
}

export default App;
