import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const InstractorRoute = () => {
    const { userInfo } = useSelector((state)=>state.auth);

    return userInfo && userInfo.role === 'instructor' ? <Outlet /> : <Navigate to='login' replace />
}

export default InstractorRoute
