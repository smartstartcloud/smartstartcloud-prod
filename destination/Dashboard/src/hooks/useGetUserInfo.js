import { useAuthContext } from "../context/AuthContext";

const useGetUserInfo = () => {
    const { authUser } = useAuthContext();
    const userID = authUser?._id;
    const userName = authUser?.username;
    const userRole = authUser?.role;
    const userFullName = authUser?.name;
    return {
        userID, userName, userRole, userFullName
    }
}

export default useGetUserInfo;