import { useEffect, useState } from 'react'
import { TEnvVars } from '../models'

const useEnvVars = () => {
  const [envVars, setEnvVars] = useState<TEnvVars>()

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const environment = import.meta.env.PROD ? 'production' : 'development'
        const url = `https://raw.githubusercontent.com/Immortal-Vault/Env-Vars/main/${environment}.json`
        const response = await fetch(url)
        const data: TEnvVars = await response.json()

        setEnvVars(data)
      } catch (error) {
        console.error('Failed to load environment variables', error)
      }
    }

    fetchEnvVars()
  }, [])

  return envVars
}

export default useEnvVars
