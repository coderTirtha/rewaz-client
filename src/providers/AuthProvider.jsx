import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import app from "../firebase/firebase.config";
import { createContext, useEffect, useRef, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import queryClient from "../queryClient";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();
    const syncSessionPromiseRef = useRef(null);
    const lastSyncedEmailRef = useRef(null);
    const previousAuthEmailRef = useRef(null);

    const syncSession = (currentUser) => {
        if (!currentUser?.email) {
            return Promise.resolve();
        }

        if (lastSyncedEmailRef.current === currentUser.email) {
            return Promise.resolve();
        }

        if (!syncSessionPromiseRef.current) {
            syncSessionPromiseRef.current = axiosPublic
                .post('/jwt', { email: currentUser.email }, { withCredentials: true })
                .then((response) => {
                    lastSyncedEmailRef.current = currentUser.email;
                    return response;
                })
                .finally(() => {
                    syncSessionPromiseRef.current = null;
                });
        }

        return syncSessionPromiseRef.current;
    };

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password).then(async (result) => {
            await syncSession(result?.user);
            return result;
        });
    }
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
            await syncSession(result?.user);
            return result;
        });
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
        lastSyncedEmailRef.current = null;
        previousAuthEmailRef.current = null;
        queryClient.clear();
        return signOut(auth);
    }
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async currentUser => {
            const nextEmail = currentUser?.email || null;
            const previousEmail = previousAuthEmailRef.current;

            if (previousEmail !== nextEmail) {
                queryClient.clear();
            }

            previousAuthEmailRef.current = nextEmail;
            setUser(currentUser);
            try {
                if (currentUser?.email) {
                    await syncSession(currentUser);
                }
                else {
                    await axiosPublic.post('/logout', {}, { withCredentials: true });
                    queryClient.clear();
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        });
        return () => {
            unSubscribe();
        }
    }, [axiosPublic]);
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