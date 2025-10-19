import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from './api'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    try {
      setLoading(true)
      const response = await getCurrentUser()
      setUser(response.user)
    } catch (error) {
      console.error('Failed to load user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    loading,
    loadUser,
    updateUser,
    logout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
