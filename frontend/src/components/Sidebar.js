import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaUsers,
    FaNetworkWired,
    FaBolt,
    FaChartBar,
    FaCog
} from "react-icons/fa";

import "./Sidebar.css";


function Sidebar(){


return(


<aside className="sidebar">


<div className="brand">


<div className="logo">

<FaBolt/>

</div>



<div>

<h2>
Hooman
</h2>

<p>
Xray Panel
</p>

</div>


</div>





<div className="menu">



<NavLink

to="/"

className={({isActive})=>
isActive ? "menu-item active" : "menu-item"
}

>

<FaUsers/>

Users

</NavLink>





<NavLink

to="/inbounds"

className={({isActive})=>
isActive ? "menu-item active" : "menu-item"
}

>

<FaNetworkWired/>

Inbounds

</NavLink>






<div className="menu-item">

<FaChartBar/>

Dashboard

</div>





<div className="menu-item">

<FaCog/>

Settings

</div>



</div>







<div className="version">

Version 1.0.0

</div>



</aside>


);


}


export default Sidebar;