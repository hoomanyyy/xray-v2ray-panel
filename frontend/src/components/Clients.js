import React from "react";

import Users from "./Users";
import CreateUserModal from "./CreateUserModal";

import "./Clients.css";



function Clients({

users,
inbounds,

createUser,
setCreateUser,

form,
changeInput,

onCreate,
onDelete

}){


return(


<div className="clients-page">





<div className="page-header">


<div>

<h1>
Users
</h1>


<p>
Manage Xray users and connections
</p>


</div>





<button

className="add-user-btn"

onClick={()=>setCreateUser(true)}

>

+ Create User

</button>



</div>









<div className="users-box">



{

users.length > 0 ?



users.map(user=>(


<Users

key={user.id}

id={user.id}

username={user.username}

uuid={user.uuid}

vless_link={user.vless_link}

onDelete={onDelete}


/>


))



:



<div className="empty">


<div className="empty-icon">

👤

</div>



<h3>

No Users Found

</h3>



<p>

Create your first Xray user

</p>


</div>



}



</div>









{

createUser &&



<CreateUserModal


form={form}

changeInput={changeInput}

inbounds={inbounds}

onCreate={onCreate}

close={()=>setCreateUser(false)}


/>



}




</div>



);


}



export default Clients;