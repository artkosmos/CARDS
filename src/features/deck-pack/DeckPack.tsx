import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TabSwitcher, TabType } from '@/components/ui/tabSwitcher'
import { Slider } from '@/components/ui/slider'
import { Icon } from '@/components/ui/icon'
import deleteIcon from '@/assets/icons/delete_icon.svg'
import { DeckTable } from '@/features/deck-pack/deck-table'
import { useMemo, useState } from 'react'
import { Pagination } from '@/components/ui/pagination'
import {
  useCreateDeckMutation,
  useDeleteDeckMutation,
  useGetDecksQuery,
  useUpdateDeckMutation,
  Deck,
  GetDeckQueryParams,
  Sort,
} from '@/services/deck-service'
import { NewDeckNameFields } from '@/types/common'
import { DeckModals } from '@/features/deck-pack'
import { AddNewDeckModal } from '@/components/modals/add-new-deck'
import searchIcon from '@/assets/icons/input_search.svg'
import { EditDeckModal } from '@/components/modals/edit-deck'
import { DeleteDeckModal } from '@/components/modals/delete-deck'
import { useDebounce } from '@/hooks'
import { useMeQuery } from '@/services/auth-service'
import s from './DeckPack.module.scss'

export const DeckPack = () => {
  const [name, setName] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [activeDeck, setActiveDeck] = useState<Deck | undefined>()
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [sliderValues, setSliderValues] = useState<number[]>([0, 61])
  const [openModal, setOpenModal] = useState<DeckModals | null>(null)
  const [sort, setSort] = useState<Sort | null>(null)
  const [authorId, setAuthorId] = useState<string | undefined>(undefined)

  const selectOptions = ['10', '20', '30', '50', '100']

  const tabs: TabType[] = [
    {
      id: '1',
      title: 'My CardsPack',
    },
    {
      id: '2',
      title: 'All CardsPack',
    },
  ]

  const sortedString = useMemo(() => {
    if (!sort) return null

    return `${sort.key}-${sort.direction}` as GetDeckQueryParams['orderBy']
  }, [sort])

  const debouncedInputValue = useDebounce(name)
  const debouncedSliderValues = useDebounce(sliderValues)

  const [createDeck] = useCreateDeckMutation()
  const [deleteDeck] = useDeleteDeckMutation()
  const [updateDeck] = useUpdateDeckMutation()
  const { data: userData } = useMeQuery()
  const { isLoading, data } = useGetDecksQuery({
    name: debouncedInputValue,
    currentPage,
    itemsPerPage,
    maxCardsCount: String(debouncedSliderValues[1]),
    minCardsCount: String(debouncedSliderValues[0]),
    orderBy: sortedString,
    authorId,
  })

  const clearFilterHandler = () => {
    setName('')
    setSliderValues([0, 61])
  }

  const openModalHandler = (value: DeckModals | null, item?: Deck) => {
    setOpenModal(value)
    setActiveDeck(item)
  }

  const deleteDeckHandler = () => {
    deleteDeck({ id: activeDeck?.id || '' })
  }

  const updateDeckHandler = (values: NewDeckNameFields) => {
    const { name, isPrivate } = values

    updateDeck({ id: activeDeck?.id || '', name, isPrivate })
  }

  const filterByAuthorHandler = (tabId: string) => {
    if (tabId === '1') {
      if (userData) {
        setAuthorId(userData.id)
      }
    }
    if (tabId === '2') {
      setAuthorId(undefined)
    }
  }

  const inputIcon = <Icon srcIcon={searchIcon} />

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>
  }

  if (!data) {
    return <div style={{ textAlign: 'center' }}>NO DATA</div>
  }

  return (
    <div className={s.contentWrapper}>
      <div className={s.deckNameAndButton}>
        <Typography variant={'large'}>Deck&apos;s list</Typography>
        <Button onClick={() => openModalHandler(DeckModals.CREATE)}>
          <Typography>Add new deck</Typography>
        </Button>
      </div>
      <div className={s.tableSettings}>
        <Input
          placeholder={'Search'}
          className={s.searchInput}
          leftSideIcon={inputIcon}
          onChange={e => setName(e.currentTarget.value)}
        />
        <TabSwitcher label={'Show decks cards'} setActiveTab={filterByAuthorHandler} tabs={tabs} />
        <Slider
          label={'Number of cards'}
          max={data.maxCardsCount}
          onValueChange={setSliderValues}
          value={sliderValues}
        />
        <Button variant={'secondary'} onClick={clearFilterHandler}>
          <Icon srcIcon={deleteIcon} />
          <Typography variant={'subtitle2'}>Clear filter</Typography>
        </Button>
      </div>
      <DeckTable data={data.items} onIconClick={openModalHandler} sort={sort} setSort={setSort} />
      <Pagination
        className={s.pagination}
        options={selectOptions}
        totalCount={data.pagination.totalItems}
        currentPage={data.pagination.currentPage}
        pageSize={data.pagination.itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
      />
      <AddNewDeckModal open={openModal} setOpen={setOpenModal} onSubmit={createDeck} />
      <EditDeckModal
        activeItem={activeDeck}
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={updateDeckHandler}
      />
      <DeleteDeckModal deleteCallBack={deleteDeckHandler} open={openModal} setOpen={setOpenModal} />
    </div>
  )
}
