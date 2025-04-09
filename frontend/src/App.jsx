import "./App.css";
import { useEffect, useState } from "react";
import Modal from "./components/modalcontext";
import Login from "./components/login/login";
import Install from "./components/install/install";
import Dashboard from "./components/dashboard/dashboard";
import History from "./components/history/history";
import ProtectedRoute from "./components/protected";
import { Route, Routes } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [alertdata, setAlertdata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokendata, setTokendata] = useState([]);

  async function accidentalert() {
    const fetched = await fetch("http://127.0.0.1:5000/login");
    const tokendata = await fetched.json();
    setTokendata(tokendata);
    console.log("token", tokendata);
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

  useEffect(() => {
    // Create an EventSource to listen for SSE
    const eventSource = new EventSource("http://127.0.0.1:5000/stream");

    // Listen for messages from the server
    eventSource.onmessage = (event) => {
      setIsModalOpen(true);
      setAlertdata(event.data);
    };

    // Clean up the EventSource when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  // const openModal = () => {
  //   if (token) {
  //     setIsModalOpen(true);
  //   } else {
  //     console.log("Token is empty. Modal will not open.");
  //   }
  // };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  console.log(alertdata)
  return (
    <div>
      {/* Button to open the modal */}
      {/* <button onClick={openModal}>Alert box</button> */}

      {/* Persistent Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>ALERT!</h2>
        <p>Accident detected : {alertdata}</p>
      </Modal>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard alertdata={alertdata} />} />
        </Route>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route element={<ProtectedRoute />}>
          <Route path="/installations" element={<Install />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/history" element={<History data={data} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
