import { createContext } from "react";

const AuthContext = createContext({});

// LM: removed that -> state will be stored in App component
// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState({});
//     return (
//         <AuthContext.Provider value={{ auth, setAuth }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

export default AuthContext;
