import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens, STORAGE_KEYS } from '@/services/api'
import { ACTIVE_GROUP_KEY } from '@/context/GroupContext'
import { isTokenExpired } from '@/utils/dates'
import type { UserResponse } from '@/types/users'
import type { LoginRequest } from '@/types/auth'

interface AuthContextValue {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  updateUser: (user: UserResponse) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    localStorage.removeItem('finito_user')
    localStorage.removeItem(ACTIVE_GROUP_KEY)
  }, [])

  const loadUserFromEmail = useCallback(async (_email: string) => {
    const fetched = await userService.getMe()
    setUser(fetched)
    localStorage.setItem('finito_user', JSON.stringify(fetched))
    return fetched
  }, [])

  // Initialize: restore session on mount
  useEffect(() => {
    const init = async () => {
      const accessToken = getAccessToken()
      const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT)

      if (!accessToken) {
        setIsLoading(false)
        return
      }

      // If token not expired, try to use cached user or validate
      if (!isTokenExpired(expiresAt)) {
        const cached = localStorage.getItem('finito_user')
        if (cached) {
          try {
            setUser(JSON.parse(cached) as UserResponse)
            setIsLoading(false)
            return
          } catch {
            // ignore
          }
        }
        // Validate token and fetch user
        try {
          const validation = await authService.validate()
          if (validation.valid && validation.email) {
            await loadUserFromEmail(validation.email)
          } else {
            logout()
          }
        } catch {
          logout()
        }
      } else {
        // Token expired — try refresh
        const refreshToken = getRefreshToken()
        if (refreshToken) {
          try {
            const tokens = await authService.refresh({ refresh_token: refreshToken })
            saveTokens(tokens.access_token, tokens.refresh_token, tokens.expires_at)
            const validation = await authService.validate()
            if (validation.valid && validation.email) {
              await loadUserFromEmail(validation.email)
            } else {
              logout()
            }
          } catch {
            logout()
          }
        } else {
          logout()
        }
      }

      setIsLoading(false)
    }

    init()
  }, [logout, loadUserFromEmail])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const tokens = await authService.login(credentials)
      saveTokens(tokens.access_token, tokens.refresh_token, tokens.expires_at)

      const validation = await authService.validate()
      if (validation.valid && validation.email) {
        await loadUserFromEmail(validation.email)
      } else {
        throw new Error('Falha ao validar sessão após login')
      }
    },
    [loadUserFromEmail],
  )

  const updateUser = useCallback((updated: UserResponse) => {
    setUser(updated)
    localStorage.setItem('finito_user', JSON.stringify(updated))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }),
    [user, isLoading, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
