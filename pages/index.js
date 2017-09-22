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

const censorshipTests = [
  {
    key: 'web_connectivity',
    name: 'Web Connectivity',
    desc: 'Check if websites are blocked.',
    href: 'https://ooni.torproject.org/nettest/web-connectivity/'
  }
]
const cTestKeys = censorshipTests.map(d => d.key)

const middleBoxTests = [
  {
    key: 'http_invalid_request_line',
    name: 'HTTP Invalid Request Line',
    desc: 'Find middleboxes.',
    href: 'https://ooni.torproject.org/nettest/http-invalid-request-line/'
  },
  {
    key: 'http_header_field_manipulation',
    name: 'HTTP Header Field Manipulation.',
    desc: 'Find middleboxes',
    href: 'https://ooni.torproject.org/nettest/http-header-field-manipulation/'
  }
]
const mbTestKeys = middleBoxTests.map(d => d.key)

const netNeutralityTests = [
  {
    key: 'ndt',
    name: 'NDT Speed Test',
    desc: 'Measure the speed and performance of your network.',
    href: 'https://ooni.torproject.org/nettest/ndt/'
  },
  {
    key: 'dash',
    name: 'DASH Video Streaming',
    desc: 'Measure video streaming performance.',
    href: 'https://ooni.torproject.org/nettest/dash/'
  }
]
const nnTestKeys = netNeutralityTests.map(d => d.key)

const isIn = (k, a) => a.indexOf(k) !== -1

const WhatCanYouDoText = props => {
  if (isIn(props.test, nnTestKeys)) {
    return <Text>
      Generate a link and share it with your friends and contacts around the
    world. Encourage them to run OONI Probe to measure the speed and
    performance of their networks!
      </Text>
  }

  if (isIn(props.test, mbTestKeys)) {
    return <Text>
      Generate a link and share it with your friends and contacts around the
    world. Encourage them to run OONI Probe to find middleboxes in their
    networks!
      </Text>
  }

  if (isIn(props.test, cTestKeys)) {
    return <Text>
      Generate a link and share it with your friends and contacts around the
    world. Encourage them to run OONI Probe to test the sites of your choice!
      </Text>
  }

  return <Text>Generate a link and share it with your friends and contacts around the world.</Text>
}

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
    this.handleEditURL = this.handleEditURL.bind(this)
    this.addURL = this.addURL.bind(this)
    this.handleDeleteURL = this.handleDeleteURL.bind(this)
    this.toggleGenerate = this.toggleGenerate.bind(this)

    this.urlRefs = new Map()
  }

  addURL() {
    let state = Object.assign({}, this.state)
    const idx = this.state.urls.length
    state.urls.push({value: 'http://', error: null, ref: null})
    this.setState(state, () => {
      console.log(this.urlRefs.get(idx))
      //this.urlRefs.get(idx).focus()
    })
  }

  toggleGenerate() {
    this.setState({generated: !this.state.generated});
  }

  handleDeleteURL(idx) {
    return ((event) => {
      let state = Object.assign({}, this.state)
      state.urls = state.urls
                        .filter((url, jdx) => jdx !== idx)
                        .map(url => Object.assign({}, url))
      this.setState(state)
    }).bind(this)
  }

  handleEditURL(idx) {
    return ((event) => {
      const value = event.target.value
      let state = Object.assign({}, this.state)
      state.urls = state.urls.map(url => Object.assign({}, url))
      state.urls[idx]['value'] = value
      state.urls[idx]['error'] = null
      if (!value.startsWith('https://') && !value.startsWith('http://')) {
        state.urls[idx]['error'] = 'URL must start with http:// or https://'
        state.error = true
      } else {
        state.error = false
      }
      this.setState(state)
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
    const universalLink = getUniversalLink(this.state.selectedTest, this.state.urls.map(u => u.value))
    const embedCode = `
    <a href='${universalLink}' class='ooni-run-button'>Run OONI!</a>
    /* If you have not already included the OONI widget code */
    <script src='https://cdn.jsdelivr.net/npm/ooni-run/dist/widgets.js'></script>
    `
    return (
      <Layout>
        <OONIRunHero href={'https://ooni.torproject.org'} />

        <Container pt={4} maxWidth={800}>
          <Flex wrap>

          <Box w={[1, 1/2]} pb={3}>
          <Heading h={2}>Test Name</Heading>
      		<RadioGroup
              name='test_name'
              value={this.state.selectedTest}
              onChange={this.handleChange('selectedTest')}>
            <TestCategoryHeading h={4} color='violet5'>Internet Censorship</TestCategoryHeading>
            {censorshipTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}
            <TestCategoryHeading h={4} color='cyan5'>Net Neutrality</TestCategoryHeading>
            {netNeutralityTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}
            <TestCategoryHeading h={4} color='orange5'>Middleboxes</TestCategoryHeading>
            {middleBoxTests.map(({key, name, desc}) => (
              <RadioButton key={key} label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}

          </RadioGroup>
          </Box>

          <Box w={[1, 1/2]}>
            <Heading h={2}>What you can do</Heading>
            <WhatCanYouDoText test={this.state.selectedTest} />

            {this.state.selectedTest == 'web_connectivity'
            && <Box pt={4}>
            <Heading h={2} pb={3}>URLs</Heading>
              {this.state.urls.length == 0
              && <div>
                Click "Add URL" below to add a URL to test
                </div>
              }
              {this.state.urls.map((url, idx) => <div key={`url-${idx}`}>
                <InputWithIconButton
                       value={url.value}
                       icon={<MdDelete />}
                       error={url.error}
                       onChange={this.handleEditURL(idx)}
                       onAction={this.handleDeleteURL(idx)} />
                </div>)}
                <div>
                  <AddURLButton onClick={this.addURL}>
                  + Add URL
                  </AddURLButton>
                </div>
            </Box>}
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
            width={[9/10, 6/10]}
            height={[9/10, 6/10]}
            p={0}
            closeButton='right'
            style={{borderRadius: '20px'}}>

            <Flex wrap>
              <Box w={[1, 1/3]} style={{backgroundColor: '#8ED8F8'}}>
                <GraphicsWithGradient>
                  <GraphicsOctopusModal />
                </GraphicsWithGradient>
              </Box>
              <Box w={[1, 2/3]}>
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
