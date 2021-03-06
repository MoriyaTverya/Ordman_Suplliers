import React, {useContext}from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import AddProduct from './AddProduct';
import Cart from '../components/Cart';
import ordman_home from '../images/ordman_home.jpg'
import { UserContext } from './UserProvider';
import Count from './Charts/count';

import BarChart from './Charts/barChart';
export default function UserDashboard() {
const user = useContext(UserContext);
  return (
    <>
     
      <div class="not-sidebar">
        <h1 className="price pink"> היי {user.user}:) ברוכה הבאה לאזור האישי </h1>
        <div className="row mt-5">
          <div className="col-3 col-lg-6 col-md-6 col-sm-12"> <Count name={user.id}/></div>
          <div className="col-4 col-lg-5 col-md-6 col-sm-12"> <BarChart name={user.id} /></div>
        </div>
       
       
      </div>
    </>

  )
}