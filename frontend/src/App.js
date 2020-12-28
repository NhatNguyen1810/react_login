
import React, {useState} from 'react';

import './App.css';
import axios from 'axios';




const  App = () =>  {

  const [result , setResult] = useState('');

  const submitPhone = async (e) => {
    e.preventDefault(); 
    console.log("sent");
    const phoneNumber = document.getElementById("phoneNumber").value;
    await axios.post('http://localhost:8000/api/record',{
      phoneNumber: phoneNumber,
      accessCode: '',
    }).then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  
  }
  
  const submitCode = async (e) => {
    e.preventDefault();
  
    console.log("code sent");
    const phoneNumber = document.getElementById("phoneNumber").value;
    const accessCode = document.getElementById("accessCode").value;
    await axios.post('http://localhost:8000/api/verify',{
      phoneNumber: phoneNumber,
      accessCode: accessCode,
    }).then(function (response) {
      if(response.data.success === true){
        setResult("Correct Code!!");
      }
      else{
        setResult("Incorrect Code");
      }
      
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  
  
  }
  return (
    <div className="App">
      
      <div id="loginform">
        <h2 id="headerTitle">Login</h2>
        <div>
          <div className="row">
            <label>Phone Number</label>
            <input name="phoneNumber" type="text" id="phoneNumber" placeholer="phone"/>
          </div>  
          <div id="button" className="row">
            <button onClick={submitPhone}>Submit Phone Number</button>
          </div>
          <div className="row">
            <label>Access Code</label>
            <input name="accessCode" type="text" id="accessCode" placeholer="access code"/>
          </div>  
          <div id="button" className="row">
            <button onClick={submitCode}>Submit Code</button>
          </div>
        </div>
        <h1 className="result">{result}</h1>
      </div>
    </div>
  );
}



export default App;
