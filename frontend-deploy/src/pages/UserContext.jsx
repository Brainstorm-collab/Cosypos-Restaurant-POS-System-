import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { getCurrentUser } from '../utils/api'
import performanceAPI from '../utils/performanceApi'

const UserContext = createContext()

const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await performanceAPI.getCurrentUserOptimized()
      setUser(response.user)
    } catch (error) {
      console.error('Failed to load user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [loadUser])

  const value = useMemo(() => ({
    user,
    loading,
    loadUser,
    updateUser,
    logout
  }), [user, loading, loadUser, updateUser, logout])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export { useUser }
