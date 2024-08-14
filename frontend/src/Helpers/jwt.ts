import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export const getCookies = ()=>{
    return Cookies.get('StudentAccessToken')
}

export const getUser=(token:any)=>{
      return jwtDecode(token)
} 
