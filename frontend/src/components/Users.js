import React from "react";
import { FaCopy, FaTrash } from "react-icons/fa";

import "./Users.css";


function Users({

id,
username,
uuid,
vless_link,

onDelete

}){


const copyConfig=()=>{

navigator.clipboard.writeText(vless_link);

alert("Config copied");

};




return(


<div className="user-row">



<div className="user-info">



<div className="avatar">

👤

</div>




<div>


<h5>
{username}
</h5>


<span>
{uuid}
</span>


</div>




</div>









<div className="user-actions">





<span className="badge">

Active

</span>






<button

className="icon copy"

onClick={copyConfig}

>

<FaCopy/>

</button>








<button

className="icon delete"

onClick={()=>onDelete(id)}

>

<FaTrash/>

</button>







</div>






</div>



);


}



export default Users;