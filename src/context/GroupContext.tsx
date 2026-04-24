import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export const ACTIVE_GROUP_KEY = 'finito_active_group'

interface GroupContextValue {
  activeGroupId: string | null
  setActiveGroup: (id: string) => void
  clearActiveGroup: () => void
}

const GroupContext = createContext<GroupContextValue | null>(null)

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [activeGroupId, setActiveGroupIdState] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_GROUP_KEY),
  )

  const setActiveGroup = useCallback((id: string) => {
    setActiveGroupIdState(id)
    localStorage.setItem(ACTIVE_GROUP_KEY, id)
  }, [])

  const clearActiveGroup = useCallback(() => {
    setActiveGroupIdState(null)
    localStorage.removeItem(ACTIVE_GROUP_KEY)
  }, [])

  const value = useMemo<GroupContextValue>(
    () => ({ activeGroupId, setActiveGroup, clearActiveGroup }),
    [activeGroupId, setActiveGroup, clearActiveGroup],
  )

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}

export function useGroupContext(): GroupContextValue {
  const ctx = useContext(GroupContext)
  if (!ctx) throw new Error('useGroupContext must be used inside GroupProvider')
  return ctx
}
