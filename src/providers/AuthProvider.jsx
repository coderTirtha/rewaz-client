import { createContext, useEffect, useRef, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import queryClient from "../queryClient";

export const AuthContext = createContext(null);

const normalizeUser = (user) => {
    if (!user) {
        return null;
    }

    return {
        ...user,
        uid: user?.userId || user?.uid || user?.id || null,
        displayName: user?.name || user?.displayName || '',
        photoURL: user?.photoURL || user?.photo || '',
    };
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();
    const previousAuthEmailRef = useRef(null);

    const refreshSession = async () => {
        try {
            const response = await axiosPublic.get('/auth/me', { withCredentials: true });
            return normalizeUser(response?.data?.user);
        }
        catch (error) {
            return null;
        }
    };

    const login = (email, password) => {
        setLoading(true);
        return axiosPublic.post('/auth/login', { email, password }, { withCredentials: true }).then((response) => {
            const nextUser = normalizeUser(response?.data?.user);
            setUser(nextUser);
            queryClient.clear();
            return { user: nextUser };
        }).finally(() => {
            setLoading(false);
        });
    }
    const createUser = (userData) => {
        setLoading(true);
        return axiosPublic.post('/auth/register', userData, { withCredentials: true }).then((response) => {
            const nextUser = normalizeUser(response?.data?.user);
            setUser(nextUser);
            queryClient.clear();
            return { user: nextUser };
        }).finally(() => {
            setLoading(false);
        });
    }
    const updateUser = (name, photo) => {
        return axiosPublic.patch('/auth/profile', {
            name,
            photoURL: photo
        }, { withCredentials: true }).then((response) => {
            const nextUser = normalizeUser(response?.data?.user);
            setUser(nextUser);
            return nextUser;
        });
    }
    const logOut = () => {
        setLoading(true);
        previousAuthEmailRef.current = null;
        queryClient.clear();
        setUser(null);
        return axiosPublic.post('/auth/logout', {}, { withCredentials: true }).finally(() => {
            setLoading(false);
        });
    }
    useEffect(() => {
        let isMounted = true;

        refreshSession()
            .then((currentUser) => {
                if (!isMounted) {
                    return;
                }

                const nextEmail = currentUser?.email || null;
                const previousEmail = previousAuthEmailRef.current;

                if (previousEmail !== nextEmail) {
                    queryClient.clear();
                }

                previousAuthEmailRef.current = nextEmail;
                setUser(currentUser);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
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