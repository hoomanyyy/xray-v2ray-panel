import React, {useEffect, useState} from "react";
import axios from "axios";

import "./Inbound.css";


const API = "http://localhost:8000/api";



function Inbound({getInbounds}){


const [showCreate,setShowCreate] = useState(false);


const [inbounds,setInbounds] = useState([]);



const [form,setForm] = useState({

remark:"",
port:"",
protocol:"vless",
network:"tcp",
security:"reality"

});






const changeInput=(key,value)=>{


setForm(prev=>({

...prev,

[key]:value


}));


};








const loadInbounds = async()=>{


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








const createInbound=async()=>{


try{


const {data}=await axios.post(

`${API}/addInbound`,

{


remark:form.remark,

port:Number(form.port),

protocol:form.protocol,

network:form.network,

security:form.security


}


);




if(data.Message){


await loadInbounds();



if(getInbounds){

getInbounds();

}



setShowCreate(false);



setForm({

remark:"",
port:"",
protocol:"vless",
network:"tcp",
security:"reality"

});


}



}catch(err){

console.log(err);

}



};







useEffect(()=>{


loadInbounds();


},[]);









return(


<div className="inbound-page">






<div className="page-header">



<div>

<h1>

Inbounds

</h1>


<p>

Manage Xray inbound connections

</p>


</div>






<button

className="add-btn"

onClick={()=>setShowCreate(true)}

>

+ Add Inbound

</button>





</div>











<div className="table-card">



<table>


<thead>


<tr>

<th>
Name
</th>


<th>
Port
</th>


<th>
Protocol
</th>


<th>
Network
</th>


<th>
Security
</th>


<th>
Status
</th>


</tr>


</thead>







<tbody>



{

inbounds.length > 0 ?



inbounds.map((item,index)=>(


<tr key={index}>


<td>
{item.remark}
</td>



<td>
{item.port}
</td>




<td>
{item.protocol}
</td>




<td>
{item.network}
</td>



<td>
{item.security}
</td>




<td>

<span className="online">

● Online

</span>


</td>



</tr>



))



:


<tr>

<td colSpan="6">

No Inbounds Found

</td>


</tr>



}



</tbody>




</table>





</div>













{

showCreate &&



<div className="modal-bg">



<div className="create-modal">



<h2>

Create Inbound

</h2>






<label>
Remark
</label>


<input

className="input"

value={form.remark}

onChange={(e)=>
changeInput(
"remark",
e.target.value
)
}

/>






<label>
Port
</label>


<input

className="input"

value={form.port}

onChange={(e)=>
changeInput(
"port",
e.target.value
)
}

/>






<label>
Protocol
</label>



<select

className="input"

value={form.protocol}

onChange={(e)=>
changeInput(
"protocol",
e.target.value
)
}

>


<option value="vless">

VLESS

</option>


<option value="vmess">

VMESS

</option>



<option value="trojan">

Trojan

</option>



</select>








<label>
Network
</label>



<select

className="input"

value={form.network}

onChange={(e)=>
changeInput(
"network",
e.target.value
)
}

>


<option value="tcp">

TCP

</option>


<option value="ws">

WS

</option>



<option value="grpc">

gRPC

</option>



</select>







<label>
Security
</label>



<select

className="input"

value={form.security}

onChange={(e)=>
changeInput(
"security",
e.target.value
)
}

>


<option value="reality">

Reality

</option>


<option value="tls">

TLS

</option>


<option value="none">

None

</option>


</select>









<div className="modal-buttons">



<button

className="cancel"

onClick={()=>setShowCreate(false)}

>

Cancel

</button>





<button

className="create"

onClick={createInbound}

>

Create

</button>




</div>






</div>



</div>



}





</div>



);


}



export default Inbound;