import React from "react";
import "./CreateUserModal.css";


function CreateUserModal({

form,
changeInput,
inbounds,

onCreate,
close

}){


return(


<div className="modal-bg">


<div className="create-modal">



<h2>
Create User
</h2>





<div className="input-group">


<label>
Username
</label>


<input

value={form.username}

onChange={(e)=>
changeInput(
"username",
e.target.value
)
}

/>


</div>







<div className="input-group">


<label>
Server Address
</label>


<input

value={form.address}

onChange={(e)=>
changeInput(
"address",
e.target.value
)
}

/>


</div>








<div className="input-group">


<label>
Port
</label>


<input

value={form.port}

onChange={(e)=>
changeInput(
"port",
e.target.value
)
}

/>


</div>








<div className="input-group">


<label>
Inbound
</label>



<select

value={form.inbound}

onChange={(e)=>
changeInput(
"inbound",
e.target.value
)
}

>



<option value="">

Select inbound

</option>





{

inbounds.map((item,index)=>(


<option

key={index}

value={item.tag}

>

{item.remark} - {item.port}

</option>


))


}



</select>



</div>










<div className="modal-buttons">



<button

className="create"

onClick={onCreate}

>

Create

</button>





<button

className="cancel"

onClick={close}

>

Cancel

</button>



</div>







</div>



</div>



);


}



export default CreateUserModal;