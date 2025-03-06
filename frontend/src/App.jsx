import './App.css';
import { useEffect, useState } from 'react'
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";
import { Route, Router, Routes, Link } from "react-router-dom";



function App() {

  const [data, setData] = useState([])

  async function getallcrashes() {
    const fetched = await fetch("http://127.0.0.1:5000/get_all")
    // const datafetched = await fetched.json()
    const crashes = await fetched.json()
    // console.log("kittio",crashes)
    setData(crashes)
  }

  useEffect(() => {
    getallcrashes()
  },
    []
  )
  return (

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard data={data} />} />
      </Routes>

  );
}

export default App;
