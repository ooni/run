import Layout from '../components/Layout'

import styled from 'styled-components'

import { getUniversalLink } from '../utils/links'

import MdDelete from 'react-icons/lib/md/delete'
import GraphicsOctopusModal from '../components/svgs/GraphicsOctopusModal.svg'
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
  Hero,
  HeroLead,
  OONISubBrandRun,
  RadioGroup,
  RadioButton,
  Flex,
  Box,
  InputWithIconButton,
  Overlay,
  Fixed,
  TwitterShareButton
} from 'ooni-components'

const censorshipTests = [
  {
    key: 'web_connectivity',
    name: 'Web Connectivity',
    desc: 'Check if websites are blocked'
  },
  {
    key: 'http_invalid_request_line',
    name: 'HTTP Invalid Request Line',
    desc: ''
  },
  {
    key: 'http_header_field_manipulation',
    name: 'HTTP Header Field Manipulation',
    desc: ''
  }
]

const netNeutralityTests = [
  {
    key: 'ndt',
    name: 'NDT Speed Test',
    desc: ''
  },
  {
    key: 'dash',
    name: 'DASH Video Streaming',
    desc: ''
  }
]

const AddURLButton = Button.extend`
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
  font-size: ${props => props.theme.fontSizes[2]}px;
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
      && <Box>
        {props.desc}
        </Box>
      }
      {props.checked
      && <Box>
          <Link styled={{fontStyle: 'italic'}} href={href}>Learn how this test works</Link>
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
        <Hero pb={4} pt={4}>
          <BrandContainer>
            <OONISubBrandRun />
          </BrandContainer>
          <HeroLead>Let's fight internet censorship together!</HeroLead>
        </Hero>
        <Container pt={4}>
          <Flex wrap>

          <Box w={[1, 1/2]} pb={3}>
          <Heading f={2} pb={3} pt={2}>Test Name</Heading>
      		<RadioGroup
              name='test_name'
              value={this.state.selectedTest}
              onChange={this.handleChange('selectedTest')}>
            <TestCategoryHeading color='violet5'>Internet Censorship</TestCategoryHeading>
            {censorshipTests.map(({key, name, desc}) => (
              <RadioButton label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}
            <TestCategoryHeading color='cyan5'>Net Neutrality</TestCategoryHeading>
            {netNeutralityTests.map(({key, name, desc}) => (
              <RadioButton label={<TestDetailsLabel name={name} desc={desc} />} value={key} />
            ))}
          </RadioGroup>
          </Box>

          <Box w={[1, 1/2]}>
          <Heading f={2} pb={3} pt={2}>What you can do</Heading>
          {this.state.selectedTest == 'web_connectivity'
          && <Text>Choose the sites you want to test, generate a link, and share
      it with your friends and contacts around the world. Encourage them to run
      OONI Probe to test the sites of your choice!</Text>
          }
          {this.state.selectedTest != 'web_connectivity'
          && <Text>Generate a link and share it with your friends and family
            around the world. Encourage them to run OONI Probe to examine
            measure network speed and performance!</Text>
          }
          {this.state.selectedTest == 'web_connectivity'
          && <Box pt={4}>
          <Heading f={2} pb={3}>URLs</Heading>
            {this.state.urls.length == 0
            && <Row><Column>
              Click "Add URL" below to add a URL to test
              </Column></Row>
            }
            {this.state.urls.map((url, idx) => <Row key={`url-${idx}`}>
              <Column>
              <InputWithIconButton
                     value={url.value}
                     icon={<MdDelete />}
                     error={url.error}
                     onChange={this.handleEditURL(idx)}
                     onAction={this.handleDeleteURL(idx)} />
              </Column>
              </Row>)}
              <Row>
              <Column>
                <AddURLButton onClick={this.addURL}>
                + Add URL
                </AddURLButton>
              </Column>
              </Row>
          </Box>}
          <Box pt={3} pb={3}>
            <Button onClick={this.toggleGenerate}>
              Generate
            </Button>
          </Box>


          </Box>

          </Flex>

        {this.state.generated
        && <div>
          <Fixed
              top
              right
              bottom
              left
              onClick={this.toggleGenerate} />
              <Overlay w={[1, 9/10]} p={0} style={{borderRadius: '20px', height: '90%'}}>
                <Flex wrap style={{height: '100%'}}>
                  <Box w={[1, 1/3]} bg='#8ED8F8'>
                    <GraphicsWithGradient>
                      <GraphicsOctopusModal />
                    </GraphicsWithGradient>
                  </Box>
                  <Box w={[1, 2/3]}>
                  <Container p={3}>
                    <Heading center>You link is ready!</Heading>

                    <Heading pt={4} pb={2} f={3} center>Share it on social media</Heading>
                    <Flex align='center' justify='center'>
                    <Box pr={2}>
                      <TwitterShareButton
                        url={universalLink}
                        message='Run OONI Probe to test for censorship!'
                        />
                    </Box>
                    </Flex>

                    <Heading pt={4} pb={2} f={3}>Share this URL with your friends</Heading>
                    <Input value={universalLink} />

                    <Heading pt={4} pb={2} f={3}>Or embed this code on your website</Heading>
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
              </Overlay>
          </div>
        }
        </Container>
      </Layout>
    )
  }
}
