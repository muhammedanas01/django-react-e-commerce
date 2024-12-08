import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';

function UserData() {
    let access_token = Cookie.get("access_token")
    let refresh_token = Cookie.get("refresh_token")
    let decoded = null
    try{
        if(access_token && refresh_token) {
            const token = refresh_token
            decoded = jwtDecode(token)
        } else {
            console.log("User token does not exist")
        }
    } catch(error){
        console.log(error)
    }

    return decoded
}

export default UserData;