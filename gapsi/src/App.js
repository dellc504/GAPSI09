import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Supplier from "./Pages/Supplier";
import SignIn from "./Pages/SignIn";
import Main from './Layout/Main'



function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/"  element={<SignIn/>} />
          <Route path="proveedor" element={<Main/>}>
            <Route index element={<Supplier/>} />
          </Route>
          <Route  path="*"  element={<Navigate to="/"  />}/>

      
        </Routes> 
    </div>
  );
}

export default App;
