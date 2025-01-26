import {Navigate} from 'react-router-dom'
import {useAuthStore} from '../store/auth'
//: React hooks like useAuthStore must be called within a React function component or another hook. Simply calling useAuthStore.isLoggedIn would break the rules of hooks.
const PrivateRouter = ( {children} ) => {
    const loggedIn = useAuthStore((state) => state.setLoggedIn)() //The () at the end immediately invokes the setLoggedIn function. and returns user if user or returns null
    return loggedIn ? <>{children}</> : <Navigate to={'/login'}/>
}
export default PrivateRouter