import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const SampleComponentUsingContext = () => {
    const {usrName} = useContext(AuthContext);

    return <div>User Name from the context: {usrName} </div>
}

export default SampleComponentUsingContext;