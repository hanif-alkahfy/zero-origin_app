"use client"

export function useSessionStorage() {
  return {
    isAuthenticated: false,
    isLoading: false,
    setOriginKey: null,
    getOriginKey: null,
    removeOriginKey: null,
  }
}
