
import React from 'react';
import { Menu, Image } from "antd";
import { Link, useLocation } from "react-router-dom";
import { ProjectOutlined, AreaChartOutlined } from '@ant-design/icons';
import logo from "../assets/images/logo.png";


function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const rol = localStorage.getItem('kyrl')
  const dashboard = [
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 12C13 11.4477 13.4477 11 14 11H19C19.5523 11 20 11.4477 20 12V19C20 19.5523 19.5523 20 19 20H14C13.4477 20 13 19.5523 13 19V12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" />
      <path d="M4 5C4 4.44772 4.44772 4 5 4H9C9.55228 4 10 4.44772 10 5V12C10 12.5523 9.55228 13 9 13H5C4.44772 13 4 12.5523 4 12V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" />
      <path d="M4 17C4 16.4477 4.44772 16 5 16H9C9.55228 16 10 16.4477 10 17V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" />
      <path d="M13 5C13 4.44772 13.4477 4 14 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H14C13.4477 8 13 7.55228 13 7V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" />
    </svg>,
  ];

 


  var logoCustomer = 'data:image/png;base64, ' + localStorage.getItem("logo")

  const menuDefault = []

  menuDefault.push(getItem('Proveedores', '1', dashboard, 'proveedor'))
 
  function getItem(label, key, icon, url) {
    return (<>
      <Menu.Item key={key}>
        <Link to={"/" + url}>
          <span
            className="icon"
            style={{
              background: page === "dashboard" && key == 1 ? color : "",
            }}
          >
            {icon}
          </span>
          <span className="label">{label}</span>
        </Link>
      </Menu.Item>
    </>)
  }

  return (
    <>
      <div className="brand">
        <img src={logoCustomer} alt="" />
        {/* <span>IOTEK</span> */}
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        {menuDefault.map((menu) => (menu))}

      
      </Menu>




     
    </>
  );
}

export default Sidenav;
