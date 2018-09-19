import Layout from '../components/Layout'

import styled from 'styled-components'

import { getUniversalLink } from '../utils/links'

import MdDelete from 'react-icons/lib/md/delete'
import GraphicsOctopusModal from '../components/svgs/GraphicsOctopusModal.svg'

import OONIRunHero from '../components/OONIRunHero'

import {
  Heading,
  Text,
  Container,
  Label,
  Input,
  Button,
  Row,
  Column,
  Link,
  Pre,
  RadioGroup,
  RadioButton,
  Flex,
  Box,
  InputWithIconButton,
  Modal,
  TwitterShareButton
} from 'ooni-components'

import {
  censorshipTests,
  netNeutralityTests,
  middleBoxTests,
  WhatCanYouDoText
} from '../utils/nettest'

const AddURLButton = styled(Button)`
  color: ${props => props.theme.colors.gray5};
  border-radius: 0;
  padding: 0;
  background-color: transparent;
  border-bottom: 1px solid ${props => props.theme.colors.gray1};
  text-align: left;
  text-transform: none;

  &:hover {
    background-color: transparent;
  color: ${props => props.theme.colors.gray6};
    border-bottom: 1px solid ${props => props.theme.colors.gray3};
  }
  &:active {
    background-color: transparent;
  color: ${props => props.theme.colors.gray7};
    border-bottom: 2px solid ${props => props.theme.colors.gray4};
  }
`

const TestCategoryHeading = styled(Heading)`
  padding: 10px 0;
  color: ${props => props.theme.colors[props.color] || props.theme.colors.black};
`

const StyleLinkButton = styled(Button)`
  text-transform: none;
`

const TestDetailsLabel = (props) => {
  // The links to the details of the test name are not in snake_case, but in dash-case
  const testName = (props.value && props.value.replace(/[_]/g, '-')) || ''
  const href = `https://ooni.torproject.org/nettest/${testName}`
  return (
    <div>
      <Box>
      {props.name}
      </Box>
      {props.checked
      && <Box pt={1}>
        <Text italic>{props.desc}</Text>
        </Box>
      }
      {props.checked
      && <Box>
          <Link href={href}><Text italic>Learn how this test works here</Text></Link>
        </Box>
      }
    </div>
  )
}

class AddURLsSection extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      urls: props.urls
    }
    this.handleDeleteURL = this.handleDeleteURL.bind(this)
    this.handleEditURL = this.handleEditURL.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.addURL = this.addURL.bind(this)
    this.urlRefs = new Map()
  }

  addURL() {
    let state = Object.assign({}, this.state)
    const idx = this.state.urls.length
    state.urls.push({value: 'http://', error: null, ref: null})
    this.props.onUpdatedURLs(state.urls)
    this.setState(state, () => {
      // This is a ghetto hax, that is a workaround for:
      // https://github.com/jxnblk/rebass/issues/329
      const urlInputs = document.getElementsByClassName('url-input')
      const target = urlInputs[urlInputs.length - 1]
      target.focus()
      target.setSelectionRange(7,7)
    })
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.addURL()
    }
  }

  handleDeleteURL(idx) {
    return ((event) => {
      let state = Object.assign({}, this.state)
      state.urls = state.urls
                        .filter((url, jdx) => jdx !== idx)
                        .map(url => Object.assign({}, url))
      this.setState(state)
      this.props.onUpdatedURLs(state.urls)
    }).bind(this)
  }

  handleEditURL(idx) {
    return ((event) => {
      const value = event.target.value
      let state = Object.assign({}, this.state)
      state.urls = state.urls.map(url => Object.assign({}, url))
      state.error = false
      let update = value.split(' ').map((line) => {
        let itm = {'value': line, 'error': null}
        if (!line.startsWith('https://') && !line.startsWith('http://')) {
          itm['error'] = 'URL must start with http:// or https://'
          state.error = true
        }
        return itm
      })
      state.urls.splice.apply(state.urls, [idx, 1].concat(update))
      this.setState(state)
    })
  }

  render() {
    const { onUpdatedURLs } = this.props
    const { urls } = this.state

    return (
      <Box pt={4}>
      <Heading h={2} pb={3}>URLs</Heading>
        {urls.length == 0
        && <div>
          Click "Add URL" below to add a URL to test
          </div>
        }
        {urls.map((url, idx) => <div key={`url-${idx}`}>
          <InputWithIconButton
                className='url-input'
                value={url.value}
                icon={<MdDelete />}
                error={url.error}
                onKeyPress={this.handleKeyPress}
                onBlur={() => onUpdatedURLs(urls)}
                onChange={this.handleEditURL(idx)}
                onAction={this.handleDeleteURL(idx)} />
          </div>)}
        <div>
          <AddURLButton onClick={this.addURL}>
          + Add URL
          </AddURLButton>
        </div>
        </Box>
      )
    }
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
const BrandContainer = styled.div`
  max-width: 100%;
  svg {
    max-width: 100%;
  }
`

export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedTest: 'web_connectivity',
      urls: [
        {value: 'http://', error: null}
      ],
      error: false,
      generated: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.toggleGenerate = this.toggleGenerate.bind(this)
  }

  toggleGenerate() {
    this.setState({generated: !this.state.generated});
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
    const universalLink = getUniversalLink(this.state.selectedTest, this.state.urls.map(u => u.value))
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
          <Flex wrap>

          <Box width={[1, 1/2]} pb={3}>
          <Heading h={2}>Test Name</Heading>
      		<RadioGroup
              name='test_name'
              value={this.state.selectedTest}
              onChange={this.handleChange('selectedTest')}>
            <TestCategoryHeading h={4} color='violet5'>Internet Censorship</TestCategoryHeading>
            {censorshipTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}
            <TestCategoryHeading h={4} color='cyan5'>Speed & Performance</TestCategoryHeading>
            {netNeutralityTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}
            <TestCategoryHeading h={4} color='orange5'>Middleboxes</TestCategoryHeading>
            {middleBoxTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}

          </RadioGroup>
          </Box>

          <Box width={[1, 1/2]}>
            <Heading h={2}>What you can do</Heading>
            <WhatCanYouDoText test={this.state.selectedTest} />

            {this.state.selectedTest == 'web_connectivity'
            && <AddURLsSection urls={this.state.urls} onUpdatedURLs={this.handleChange('urls')} />}
            <Box pt={3} pb={3}>
              <Button onClick={this.toggleGenerate}>
                Generate
              </Button>
            </Box>

          </Box>

          </Flex>

          <Modal
            onHideClick={this.toggleGenerate}
            show={this.state.generated}
            width={[9/10, 7/10]}
            p={0}
            closeButton='right'
            style={{borderRadius: '20px'}}>

            <Flex css={{minHeight: '100%'}}>
              <Box width={[1, 1/3]} css={{minHeight: '100%', backgroundColor: '#8ED8F8'}}>
                <GraphicsWithGradient>
                  <GraphicsOctopusModal />
                </GraphicsWithGradient>
              </Box>
              <Box width={[1, 2/3]}>
              <Container p={[1, 2]} ml={[2, 4]} mr={[2, 4]}>
                <Heading h={1} center>Your link is ready!</Heading>

                <Heading pt={4} pb={2} h={3} center>Share it on social media</Heading>
                <Flex align='center' justify='center'>
                  <Box pr={2}>
                    <TwitterShareButton
                      url={universalLink}
                      message='Run OONI Probe to test for censorship!'
                      />
                  </Box>
                  <Box pr={2}>
                    <Link href={universalLink}>
                      <StyleLinkButton>
                        Link
                      </StyleLinkButton>
                    </Link>
                  </Box>
                </Flex>

                <Heading pt={4} pb={2} h={3}>Share this URL with your friends</Heading>
                <Input value={universalLink} />

                <Heading pt={4} pb={2} h={3}>Or embed this code on your website</Heading>
                <Input type='textarea' rows={6} value={embedCode} />

                <Box pt={4}>
                  <Flex justify='center' align='center'>
                    <Button onClick={this.toggleGenerate}>
                    Done
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
