import OONIRunHero from 'components/OONIRunHero'

import { Container, Box, Checkbox } from 'ooni-components'

import RunLinkList from 'components/List'
import { useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

const List = () => {
  const { control } = useForm({ defaultValues: { only_mine: false } })
  const onlyMineValue = useWatch({
    control,
    name: 'only_mine',
    defaultValue: false,
  })

  const queryParams = useMemo(() => {
    if (onlyMineValue) return { only_mine: true, include_archived: true }
  }, [onlyMineValue])

  return (
    <>
      <OONIRunHero href="/" />
      <Container my={5}>
        <Box mb={3}>
          <Controller
            render={({ field }) => (
              <Checkbox
                label="Show only mine"
                {...field}
                id="backgroundRun"
                checked={field.value}
              />
            )}
            name={`only_mine`}
            control={control}
          />
        </Box>
        <RunLinkList queryParams={queryParams} />
      </Container>
    </>
  )
}

export default List
