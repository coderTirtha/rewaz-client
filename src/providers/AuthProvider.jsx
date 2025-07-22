import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import app from "../firebase/firebase.config";
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();
    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const updateUser = (name, photo) => {
        // setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
    }
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            const userEmail = currentUser?.email || user?.email;
            const loggedUser = { email: userEmail }
            setUser(currentUser);
            // console.log(currentUser);
            setLoading(false);
            if (currentUser) {
                axiosPublic.post('/jwt', loggedUser, { withCredentials: true })
                    .then(res => {
                        console.log(res.data);
                    });
            }
            else {
                axiosPublic.post('/logout', loggedUser, { withCredentials: true })
                    .then(res => {
                        console.log(res.data);
                    })
            }
        });
        return () => {
            unSubscribe();
        }
    }, []);
    const authInfo = {
        user,
        loading,
        login,
        createUser,
        updateUser,
        logOut
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;