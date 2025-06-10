import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useEffect, useState } from 'react'
import { publicInstance, AUTH_URLS } from '../services/api'


export const AuthContext = createContext(null)

export default function AuthContextProvider({ children }) {
  const [loginData, setLoginData] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [userName, setUserName] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)

  const saveLoginData = () => {
    const encodedToken = localStorage.getItem('token')
    console.log('Raw token from localStorage:', encodedToken) // Debug log

    if (encodedToken) {
      try {
        const decodedToken = jwtDecode(encodedToken)
        console.log('Full decoded token:', JSON.stringify(decodedToken, null, 2)) // Debug log

        // Extract user data from the decoded token
        const userData = decodedToken.data || decodedToken.payLoad || decodedToken
        console.log('User data before processing:', JSON.stringify(userData, null, 2)) // Debug log

        if (!userData) {
          console.error('No user data found in token')
          setAuthLoading(false)
          return
        }

        // Set the login data with the full user information
        const loginDataObj = {
          email: userData.email,
          role: userData.role,
          isValid: userData.isValid,
          OTP: userData.OTP,
          OTP_ExpiresAt: userData.OTP_ExpiresAt
        }
        console.log('Setting login data:', JSON.stringify(loginDataObj, null, 2)) // Debug log
        setLoginData(loginDataObj)

        // Set the user name and role
        if (userData.email) {
          const displayName = userData.email.split('@')[0]
          console.log('Setting display name to:', displayName) // Debug log
          setUserName(displayName)
        } else {
          console.log('No email found in user data') // Debug log
        }

        if (userData.role) {
          console.log('Setting user role to:', userData.role) // Debug log
          setUserRole(userData.role)
        } else {
          console.log('No role found in user data') // Debug log
        }

        if (userData._id) {
          console.log('Setting user ID to (_id):', userData._id) // Debug log
          setUserId(userData._id)
        } else if (userData.id) { // Check for 'id' if '_id' is not present
          console.log('Setting user ID to (id):', userData.id) // Debug log
          setUserId(userData.id)
        } else {
          console.log('No user ID (_id or id) found in user data') // Debug log
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('token')
        setLoginData(null)
        setUserName(null)
        setUserRole(null)
        setUserId(null)
      } finally {
        setAuthLoading(false)
      }
    } else {
      console.log('No token found in localStorage') // Debug log
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    saveLoginData()
  }, [])

  const logout = async () => {
    try {
      // Call the logout API endpoint
      await publicInstance.post(AUTH_URLS.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all local storage and state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setLoginData(null);
      setUserName(null);
      setUserRole(null);
      setProfileImage(null);
      setUserId(null);
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginData,
        saveLoginData,
        logout,
        userName,
        userRole,
        profileImage,
        loading: authLoading,
        userId,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider')
  }
  return context
}
