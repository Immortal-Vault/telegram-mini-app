import { useEffect, useState } from 'react'
import {
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Input,
  List,
  Modal,
  Text,
  TextInput,
} from '@mantine/core'
import { TFolder } from '../../../../types'
import { useSecrets } from '../../../../stores'
import { useTranslation } from 'react-i18next'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { v7 as uuid } from 'uuid'

export const Folders = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { t } = useTranslation('folders')
  const { folders, selectedFolder, secrets, setFolders, saveSecrets, setSelectedFolder } =
    useSecrets()
  const [filteredFolders, setFilteredFolders] = useState<TFolder[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [addModalState, { open: openAddModal, close: closeAddModal }] = useDisclosure(false)

  const addFolderForm = useForm({
    initialValues: {
      label: '',
    },
    validate: {
      label: (val) => (val.length < 1 ? 'fields.label.canNotBeEmpty' : null),
    },
  })

  useEffect(() => {
    handleSearch(searchQuery)
  }, [folders])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredFolders(folders)
    } else {
      const filtered = folders.filter((folder) =>
        folder.label.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredFolders(filtered)
    }
  }

  const addFolder = async () => {
    const values = addFolderForm.values

    if (values.label.length < 1) {
      return
    }

    const folder: TFolder = {
      id: uuid(),
      lastUpdated: Date.now(),
      ...values,
    }

    const newFolders = [folder, ...folders]
    setFolders(newFolders)
    setFilteredFolders(newFolders)
    await saveSecrets(secrets, newFolders)
  }

  return (
    <>
      <Modal
        centered={true}
        opened={addModalState}
        onClose={closeAddModal}
        size='auto'
        title={t('modals.addFolder.title')}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Flex direction={'column'} gap={'md'}>
          <TextInput
            label={t('fields.label.title')}
            value={addFolderForm.values.label}
            onChange={(event) => addFolderForm.setFieldValue('label', event.currentTarget.value)}
            error={addFolderForm.errors.label && t(addFolderForm.errors.label.toString())}
          />
        </Flex>

        <Group mt='xl' justify={'end'}>
          <Button
            onClick={() => {
              closeAddModal()
              addFolderForm.reset()
            }}
          >
            {t('modals.addFolder.buttons.cancel')}
          </Button>
          <Button
            onClick={() => {
              if (addFolderForm.validate().hasErrors) {
                return
              }

              addFolder()
              closeAddModal()
              addFolderForm.reset()
            }}
          >
            {t('modals.addFolder.buttons.submit')}
          </Button>
        </Group>
      </Modal>
      <Grid grow>
        <Grid.Col span={3} style={{ height: '100%', paddingRight: '20px' }}>
          <Input
            placeholder={t('search.placeholder')}
            mb={'md'}
            value={searchQuery}
            onChange={(e) => handleSearch(e.currentTarget.value)}
          />
          <Flex gap={'md'}>
            <Button mb={'md'} fullWidth={isMobile} onClick={openAddModal}>
              {t('buttons.add')}
            </Button>
          </Flex>
          <Text size='lg' c='gray' mb='md'>
            {t('folders')}
          </Text>
          <List spacing='md'>
            <List.Item
              key={'allFolders'}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedFolder(null)
              }}
            >
              <Group align='center' justify='space-between'>
                <Text size='sm' c={!selectedFolder ? 'blue' : 'white'}>
                  {t('allElements')}
                </Text>
              </Group>
            </List.Item>
            <Divider my={'md'} />
            {filteredFolders.map((folder, index) => (
              <>
                <List.Item
                  key={folder.id}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedFolder(folder)
                  }}
                >
                  <Group align='center' justify='space-between'>
                    <Text size='sm' c={selectedFolder?.id === folder.id ? 'blue' : 'white'}>
                      {folder.label}
                    </Text>
                  </Group>
                </List.Item>
                {index != filteredFolders.length - 1 && <Divider my={'md'} />}
              </>
            ))}
          </List>
        </Grid.Col>
      </Grid>
    </>
  )
}