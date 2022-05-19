import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost/apiframeworks/";
  const [data, setData]=useState([]);
  


  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      console.log(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  useEffect(()=>{
    peticionGet();
  },[])


    return (
    <div className="App">
  
    </div>
  );
}

export default App;

