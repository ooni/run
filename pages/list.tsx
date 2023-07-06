import OONIRunHero from 'components/OONIRunHero'

import { Container } from 'ooni-components'

import RunLinkList from 'components/List'

const List = () => {
  return (
    <>
      <OONIRunHero href="/" />
      <Container my={5}>
        <RunLinkList />
      </Container>
    </>
  )
}

export default List
