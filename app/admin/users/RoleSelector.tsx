'use client'

import { useState, useRef, useEffect } from 'react'
import { updateUserRole } from '../actions'

interface RoleSelectorTranslations {
  change_role: string
  updating: string
  role_admin: string
  role_user: string
  suspend_user: string
}

interface RoleSelectorProps {
  userId: string
  currentRole: string
  t: RoleSelectorTranslations
}

export default function RoleSelector({ userId, currentRole, t }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [role, setRole] = useState(currentRole)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRoleChange = async (newRole: 'user' | 'admin') => {
    if (newRole === role) {
      setIsOpen(false)
      return
    }
    setIsUpdating(true)
    const result = await updateUserRole(userId, newRole)
    if (result.error) {
      alert(result.error)
    } else {
      setRole(newRole)
    }
    setIsUpdating(false)
    setIsOpen(false)
  }

  const isAdmin = role === 'admin'

  const roles = [
    { value: 'admin' as const, label: t.role_admin, icon: 'shield' },
    { value: 'user' as const, label: t.role_user, icon: 'person' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg transition-colors w-full md:w-auto justify-center disabled:opacity-50 ${
          isOpen
            ? 'bg-[#006655] text-white shadow-md hover:bg-[#004d40]'
            : isAdmin
              ? 'border border-[#19322F]/10 bg-white shadow-sm text-[#19322F] hover:bg-[#19322F] hover:text-white'
              : 'border border-gray-200 bg-transparent text-[#19322F]/70 hover:border-[#19322F] hover:text-[#19322F] group-hover:bg-white group-hover:shadow-sm'
        }`}
      >
        {isUpdating ? t.updating : t.change_role}
        <span className="material-icons text-[16px] ml-2">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl bg-[#006655] ring-1 ring-black/5 overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="py-1" role="menu">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => handleRoleChange(r.value)}
                className={`group/item flex items-center w-full px-4 py-3 text-xs transition-colors ${
                  role === r.value
                    ? 'text-white bg-white/10 font-medium hover:bg-white/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                role="menuitem"
              >
                <span className={`material-icons text-sm mr-3 ${
                  role === r.value ? 'text-white' : 'text-white/50 group-hover/item:text-white'
                }`}>
                  {r.icon}
                </span>
                {r.label}
              </button>
            ))}
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => setIsOpen(false)}
              className="group/item flex items-center w-full px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors"
              role="menuitem"
            >
              <span className="material-icons text-sm mr-3 text-red-300 group-hover/item:text-red-100">
                block
              </span>
              {t.suspend_user}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
