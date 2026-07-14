import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {useEffect, useState} from "react";
import axios from "axios";

import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";


import Sidebar from "./components/Sidebar";
import Clients from "./components/Clients";
import Inbound from "./components/Inbound";


const API = "http://localhost:8000/api";



function App(){


const [users,setUsers] = useState([]);

const [inbounds,setInbounds] = useState([]);


const [createUser,setCreateUser] = useState(false);



const [form,setForm] = useState({

username:"",
address:"",
port:"",
inbound:""

});





const changeInput=(key,value)=>{


setForm(prev=>({

...prev,

[key]:value

}));


};








// USERS

const getUsers = async()=>{


try{


const {data}=await axios.post(
`${API}/getUsers`
);


setUsers(data.users || []);



}catch(err){

console.log(err);

}


};









// INBOUNDS

const getInbounds=async()=>{


try{


const {data}=await axios.post(
`${API}/getInbounds`
);


setInbounds(
data.inbounds || []
);



}catch(err){

console.log(err);

}


};









// CREATE USER


const createUserHandler=async()=>{


try{


const {data}=await axios.post(

`${API}/createUser`,

{

username:form.username,

server:form.address,

port:form.port,

inbound:form.inbound

}

);



if(data.Message){


await getUsers();


setCreateUser(false);



setForm({

username:"",
address:"",
port:"",
inbound:""

});


}



}catch(err){

console.log(err);

}


};








// DELETE USER


const deleteUserHandler=async(id)=>{


try{


await axios.post(

`${API}/deleteUser`,

{

user_id:id

}

);


getUsers();



}catch(err){

console.log(err);

}


};









useEffect(()=>{


getUsers();

getInbounds();


},[]);









return(


<div className="panel">


<Sidebar/>


<main className="content">


<Routes>



<Route

path="/"

element={


<Clients


users={users}

inbounds={inbounds}


createUser={createUser}

setCreateUser={setCreateUser}


form={form}

changeInput={changeInput}


onCreate={createUserHandler}

onDelete={deleteUserHandler}


/>


}


/>






<Route

path="/inbounds"

element={


<Inbound

getInbounds={getInbounds}


/>


}


/>





</Routes>



</main>


</div>


);


}







export default function Root(){


return(

<BrowserRouter>

<App/>

</BrowserRouter>

);


}