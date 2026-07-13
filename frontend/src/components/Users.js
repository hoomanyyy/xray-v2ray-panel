import React, {useState} from "react";
import "./Users.css";
import { FaCopy, FaTrash } from "react-icons/fa";


const Users = ({username, uuid, vless_link , id , usersDeleteOnPress}) => {


    const [active, setActive] = useState(true);



    function copyConfig(){

        navigator.clipboard.writeText(vless_link);

    }



    return (

        <div className="user-card shadow-lg d-flex align-items-center justify-content-between">


            <div className="d-flex align-items-center gap-3">


                <h4 className="m-0">
                    {username}
                </h4>



                <small className={active ? "active" : "disabled"}>

                    {
                        active 
                        ? "Active" 
                        : "Disabled"
                    }

                </small>


            </div>





            <div className="d-flex align-items-center gap-3">


                <p className="uuid m-0">
                    {uuid}
                </p>



                <button
                className="copy"
                onClick={copyConfig}
                >

                    <FaCopy />

                </button>



                <button
                className="delete"
                onClick={() => usersDeleteOnPress(id)}
                >

                    <FaTrash />

                </button>


            </div>



        </div>

    )

}


export default Users;