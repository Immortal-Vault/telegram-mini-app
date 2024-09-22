import { AppShell, Burger, Group, Image, ScrollArea, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import {
  EPrimaryViewPage,
  EPrimaryViewTabType,
  ESettingsViewPage,
  TPrimaryViewTab,
} from '../../types'
import { useDisclosure } from '@mantine/hooks'
import { createTab, LOCAL_STORAGE, sendSuccessNotification } from '../../shared'
import { Profile, Settings } from './subviews'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../stores'

export default function Primary() {
  const { t, i18n } = useTranslation('views')
  const { authSignOut } = useAuth()
  const [burgerState, { toggle, close: closeBurger }] = useDisclosure()
  const [currentPage, setCurrentPage] = useState(EPrimaryViewPage.Profile)
  const [settingsPage, setSettingsPage] = useState(ESettingsViewPage.Main)

  useEffect(() => {
    const userLocalization = localStorage.getItem(LOCAL_STORAGE.USER_LOCALE)
    if (userLocalization && i18n.languages.includes(userLocalization)) {
      i18n.changeLanguage(userLocalization)
    }
  }, [])

  const mainViewTabs: TPrimaryViewTab[] = [
    {
      type: EPrimaryViewTabType.Button,
      name: t('profile.name'),
      onClick: () => {
        setCurrentPage(EPrimaryViewPage.Profile)
        closeBurger()
      },
    },
    {
      type: EPrimaryViewTabType.Accordion,
      name: t('settings.name'),
      sections: [
        {
          title: t('settings.subviews.main.name'),
          click: () => {
            setSettingsPage(ESettingsViewPage.Main)
            setCurrentPage(EPrimaryViewPage.Settings)
            closeBurger()
          },
        },
        {
          title: t('settings.subviews.vault.name'),
          click: () => {
            setSettingsPage(ESettingsViewPage.Vault)
            setCurrentPage(EPrimaryViewPage.Settings)
            closeBurger()
          },
        },
      ],
    },
    {
      type: EPrimaryViewTabType.Button,
      name: t('auth:signOut:title'),
      onClick: () => {
        authSignOut(false)
        sendSuccessNotification(t('auth:signOut:successful'))
      },
    },
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !burgerState } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={burgerState} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Image src={'/logo.svg'} w={'2.5rem'} alt={'Immortal Vault'} />
          <Title order={2}>Immortal Vault</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        <AppShell.Section grow component={ScrollArea}>
          {mainViewTabs.map((tab, index) => createTab(tab, index, t))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        style={{
          height: '100vh',
          backgroundColor: 'rgb(36, 36, 36)',
        }}
      >
        {currentPage === EPrimaryViewPage.Profile && <Profile />}
        {currentPage === EPrimaryViewPage.Settings && <Settings currentPage={settingsPage} />}
      </AppShell.Main>
      <AppShell.Footer></AppShell.Footer>
    </AppShell>
  )
}
