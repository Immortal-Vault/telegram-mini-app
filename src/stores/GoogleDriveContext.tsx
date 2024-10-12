import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth, useEnvVars } from './'
import { getGoogleDriveState } from '../api'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { EAuthState } from '../types'

export interface GoogleDriveContextType {
  googleDriveState: boolean
  googleDriveEmail: string
  setGoogleDriveState: Dispatch<SetStateAction<boolean>>
}

const GoogleDriveContext = createContext<GoogleDriveContextType>({
  googleDriveState: false,
  googleDriveEmail: '',
  setGoogleDriveState: function (): void {
    throw new Error('Function is not implemented.')
  },
})

interface GoogleDriveProviderProps {
  children: ReactNode
}

export const GoogleDriveProvider = ({ children }: GoogleDriveProviderProps) => {
  const { t } = useTranslation()
  const { envs } = useEnvVars()
  const authContext = useAuth()

  const [googleDriveState, setGoogleDriveState] = useState(false)
  const [googleDriveEmail, setGoogleDriveEmail] = useState('')

  const fetchGoogleDriveState = async () => {
    const googleDriveEmail = await getGoogleDriveState(envs, t, authContext)
    if (!googleDriveEmail) {
      setGoogleDriveState(false)
      return
    }
    setGoogleDriveState(true)
    setGoogleDriveEmail(googleDriveEmail)
  }

  useEffect(() => {
    if (!envs || authContext.authState != EAuthState.Authorized) {
      return
    }

    fetchGoogleDriveState()
  }, [envs, authContext.authState])

  const contextValue = useMemo(
    () => ({
      googleDriveState,
      googleDriveEmail,
      setGoogleDriveState,
    }),
    [googleDriveState, googleDriveEmail],
  )

  return (
    <GoogleDriveContext.Provider value={contextValue}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </GoogleDriveContext.Provider>
  )
}

export const useGoogleDrive = () => {
  return useContext(GoogleDriveContext)
}

export default GoogleDriveProvider