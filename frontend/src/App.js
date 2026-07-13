import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Users from './components/Users';
import { useEffect, useState } from 'react';
import axios from "axios"

function App() {

  const [createUser , setCreateUser] = useState(null)

  const [username , setUsername] = useState(null)
  const [ address , setAddress ] = useState(null)
  const [ port , setPort ] = useState(null)

  const [ users , setUsers ] = useState([])

  const HandleCreateUserButton = async () => {
    
    setCreateUser(true)
    console.log("set create user")

  }

  const HandleCreateUser = async () => {

    try{
      
      const response = await axios.post("http://localhost:8000/api/createUser" , {
        username , 
        server: address , 
        port
    })
    
    if(response.data.Message == true){
      console.log("create user successfully")
    }else{
      console.log("create user not successfully")
    }

    setCreateUser(false)
    getUsers()
  }catch(err){
    
    console.log("error: " , err)
  }

  }

const handleDeleteUser = async (id) => {

  try {

    const response = await axios.post(
      "http://localhost:8000/api/deleteUser",
      {
        user_id: id
      }
    );

    if(response.data.Message === true){
      console.log("deleted user");

      getUsers();
    }

  } catch(err) {

    console.log(err);

  }

}

  const getUsers = async () => {
    
    const response = await axios.post("http://localhost:8000/api/getUsers" , 
      {}
    )

    console.log("response: " , response.data)

    if(response.data){
      setUsers(response.data.users)
    }

  }

  useEffect(() => {
    getUsers()
  } , [])

  return (
    <div className="App">
      <header className='p-4 d-flex justify-content-between' style={{ backgroundColor: "#0d0923" }}>
        <button onClick={HandleCreateUserButton} className='btn' style={{ background: "#1f1460" , color: "#4e68dc" }}>create user</button>
        <h3 style={{color: "#392e7b"}}>hooman xray panel</h3>
      </header>
      {
        createUser && (
          <div style={{ width: "100%" , height: "100%" , inset: 0 , zIndex: "999" , transition: "all 0.25s ease", backdropFilter: "blur(10px)" , position: "fixed" , display: "flex" , justifyContent: "center" , alignItems:"center" }}>
            <div className='container shadow-lg p-4 d-flex flex-column gap-3 containerCreateUser' style={{ background: "#262b6c" , width: "36%" , borderRadius: "10px" }}>
              <div className='d-flex flex-column gap-2 inCreateUser'>
                <h5 style={{ color: "#b8b1e1" }}>username</h5>
                <input className='input' onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className='d-flex flex-column gap-2'>
                <h5 style={{ color: "#b8b1e1" }}>address</h5>
                <input onChange={(e) => setAddress(e.target.value)} className='input' />
              </div>
              <div className='d-flex flex-column gap-2'>
                <h5 style={{ color: "#b8b1e1" }}>port</h5>
                <input onChange={(e) => setPort(e.target.value)} className='input' />
              </div>
              <div className='d-flex flex-column gap-3'>
                <button className='btn btn-primary' onClick={HandleCreateUser}>create</button>
                <button className='btn btn-danger' onClick={() => setCreateUser(false)}>cancel</button>
              </div>
            </div>
          </div>
        )
      }
      <main>
        <div className='p-5 m-4 shadow-lg' style={{background: "#1f1460",  borderRadius: 13 }}>
{
  users.length > 0 ? (

    users.map((user,index)=>(

      <Users
        key={index}
        username={user.username}
        uuid={user.uuid}
        id={user.id}
        vless_link={user.vless_link}
        usersDeleteOnPress={handleDeleteUser}
      />

    ))

  ) : (

<div 
  className="d-flex flex-column align-items-center justify-content-center"
  style={{
    color:"#b8b1e1",
    padding:"50px",
    textAlign:"center"
  }}
>

  <div
    style={{
      width:"70px",
      height:"70px",
      borderRadius:"50%",
      background:"#262b6c",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      fontSize:"32px",
      marginBottom:"15px"
    }}
  >
    👤
  </div>


  <h3
    style={{
      color:"#ffffff",
      margin:0,
      fontWeight:"600"
    }}
  >
    No Users Found
  </h3>


  <p
    style={{
      color:"#aaa7d5",
      marginTop:"8px"
    }}
  >
    Create your first XRay user to get started
  </p>


</div>

  )
}
        </div>
      </main>
    </div>
  );
}

export default App;
