import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Heading,
  Text,
  Container,
  Input,
  Button,
  Link,
  RadioGroup,
  RadioButton,
  Flex,
  Box,
  Modal,
  TwitterShareButton
} from 'ooni-components'

import Layout from '../components/Layout'
import { getUniversalLink } from '../utils/links'
import GraphicsOctopusModal from '../components/svgs/GraphicsOctopusModal.svg'
import OONIRunHero from '../components/OONIRunHero'

import {
  censorshipTests,
  netNeutralityTests,
  middleBoxTests,
  WhatCanYouDoText,
  messages as nettestMessages
} from '../utils/nettest'
import URLs from '../components/URLs'

const TestCategoryHeading = styled(Heading)`
  padding: 10px 0;
  color: ${props => props.theme.colors[props.color] || props.theme.colors.black};
`

const StyleLinkButton = styled(Button)`
  text-transform: none;
`

const ItalicText = styled(Text)`
  font-style: italic;
`

const TestDetailsLabel = ({ id, name, desc, checked, value }) => {
  const intl = useIntl()
  // The links to the details of the test name are not in snake_case, but in dash-case
  const testName = (value && value.replace(/[_]/g, '-')) || ''
  const href = `https://ooni.org/nettest/${testName}`
  return (
    <div>
      <Box>
        {intl.formatMessage(nettestMessages[`${id}_name`])}
      </Box>
      {checked
        && <Box pt={1}>
          <ItalicText>
            {intl.formatMessage(nettestMessages[`${id}_desc`])}
          </ItalicText>
        </Box>
      }
      {checked
        && <Box>
          <Link color='blue7' href={href}><ItalicText>{intl.formatMessage(nettestMessages['learn'])}</ItalicText></Link>
        </Box>
      }
    </div>
  )
}

const GraphicsWithGradient = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;

  svg {
    width: 100%;
  }

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(to bottom,
      rgba(142, 219, 248, 0),
      rgba(63, 128, 162, 1)
    );
  }
`

const TwitterButton = ({ universalLink }) => {
  const intl = useIntl()
  return (
    <TwitterShareButton
      url={universalLink}
      message={intl.formatMessage({id: 'Share.Twitter.Tweet', defaultMessage: 'Run OONI Probe to test for censorship!'})}
    />
  )
}

export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedTest: 'web_connectivity',
      urls: [],
      error: false,
      generated: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.toggleGenerate = this.toggleGenerate.bind(this)
    this.onSubmitURLs = this.onSubmitURLs.bind(this)
  }

  toggleGenerate() {
    this.setState({generated: !this.state.generated});
  }

  onSubmitURLs({ urls }) {
    this.setState({
      urls: urls.map(u => u.url),
      generated: !this.state.generated
    })
  }

  handleChange(stateName) {
    return ((value, event) => {
      let state = Object.assign({}, this.state)
      const urls = this.state.urls.filter((url) => url !== '').map(u => u.value)
      state[stateName] = value
      this.setState(state)
    }).bind(this)
  }

  render() {
    const universalLink = getUniversalLink(this.state.selectedTest, [...this.state.urls])
    const embedCode = `

    /* For a simple button */
    <a href='${universalLink}' class='ooni-run-button'>Run OONI!</a>

    /* For a tall banner */
    <div data-link='${universalLink}' class='ooni-run-banner'>
      Fight Censorship
    </div>
    /* If you have not already included the OONI widget code */
    <script src='https://cdn.jsdelivr.net/npm/ooni-run/dist/widgets.js'></script>
    `
    return (
      <Layout>
        <OONIRunHero href={'https://ooni.torproject.org'} />

        <Container pt={4} maxWidth={800}>
          <Flex flexWrap='wrap'>
          <Box width={[1, 1/2]} pb={3}>
          <Heading h={2}>
            <FormattedMessage id='Home.Heading.TestName' defaultMessage='Test Name' />
          </Heading>
      		<RadioGroup
              name='test_name'
              value={this.state.selectedTest}
              onChange={this.handleChange('selectedTest')}>
            <TestCategoryHeading h={4} color='violet5'>
              <FormattedMessage id='Sidebar.WebConnectivity.Title' defaultMessage='Internet Censorship' />
            </TestCategoryHeading>
            {censorshipTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel id={key} name={name} desc={desc} />} value={key} />
            ))}
            <TestCategoryHeading h={4} color='cyan5'>
              <FormattedMessage id='Sidebar.Performance.Title' defaultMessage='Speed & Performance' />
            </TestCategoryHeading>
            {netNeutralityTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel id={key} name={name} desc={desc} />} value={key} />
            ))}
            <TestCategoryHeading h={4} color='orange5'>
              <FormattedMessage id='Sidebar.Middleboxes.Title' defaultMessage='Middleboxes' />
            </TestCategoryHeading>
            {middleBoxTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel id={key} name={name} desc={desc} />} value={key} />
            ))}

          </RadioGroup>
          </Box>

          <Box width={[1, 1/2]}>
            <Heading h={2}><FormattedMessage id='Title.WhatCanYouDo' defaultMessage='What you can do' /></Heading>
            <WhatCanYouDoText test={this.state.selectedTest} />

            {this.state.selectedTest == 'web_connectivity' ? (
              <URLs onSubmit={this.onSubmitURLs} />
            ) : (
              <Box pt={3} pb={3}>
                <Button onClick={this.toggleGenerate}>
                  <FormattedMessage id='Button.Generate' defaultMessage='Generate' />
                </Button>
              </Box>
            )}
          </Box>
          </Flex>

          <Modal
            onHideClick={this.toggleGenerate}
            show={this.state.generated}
            width={[9/10, 7/10]}
            p={0}
            closeButton='right'
            style={{borderRadius: '20px'}}>

            <Flex flexWrap='wrap' style={{minHeight: '100%'}}>
              <Box width={[1, 1/3]} height={[1, 1/3]} style={{backgroundColor: '#8ED8F8'}}>
                <GraphicsWithGradient>
                  <GraphicsOctopusModal />
                </GraphicsWithGradient>
              </Box>
              <Box width={[1, 2/3]}>
              <Container p={[1, 2]} ml={[2, 4]} mr={[2, 4]}>
                <Heading h={1} textAlign='center'>
                  <FormattedMessage id='Modal.Heading.LinkReady' defaultMessage='Your link is ready!' />
                </Heading>

                <Heading pt={4} pb={2} h={3} textAlign='center'>
                  <FormattedMessage id='Modal.Heading.ShareIt' defaultMessage='Share it on social media' />
                </Heading>
                <Flex alignItems='center' justifyContent='center'>
                  <Box pr={2}>
                    <TwitterButton universalLink={universalLink} />
                  </Box>
                  <Box pr={2}>
                    <Link href={universalLink}>
                      <StyleLinkButton>
                        <FormattedMessage id='Modal.Button.Link' defaultMessage='Link' />
                      </StyleLinkButton>
                    </Link>
                  </Box>
                </Flex>

                <Heading pt={4} pb={2} h={3}>
                  <FormattedMessage id='Modal.Heading.ShareThisURL' defaultMessage='Share this URL with your friends' />
                </Heading>
                <Input value={universalLink} />

                <Heading pt={4} pb={2} h={3}>
                  <FormattedMessage id='Modal.Heading.EmbedThisCode' defaultMessage='Or embed this code on your website' />
                </Heading>
                <Input type='textarea' rows={6} value={embedCode} />

                <Box pt={4}>
                  <Flex justify='center' align='center'>
                    <Button onClick={this.toggleGenerate}>
                      <FormattedMessage id='Modal.Button.Done' defaultMessage='Done' />
                    </Button>
                  </Flex>
                </Box>
              </Container>
              </Box>
            </Flex>
          </Modal>
        </Container>
      </Layout>
    )
  }
}
