import React from "react";
import logo from './logo.PNG';


import './Welcome.css'; 

function WelcomePage () {

    return(

        <div className='welcome-main'>
            <h1>Welcome To:</h1> <br></br>

            <div className='welcome-sub-main'>
            <img src={logo} alt={"logo"}/>

            </div>
        </div>


    );
}


export default WelcomePage;
