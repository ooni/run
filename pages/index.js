import Layout from '../components/Layout'

import styled from 'styled-components'

import { getUniversalLink } from '../utils/links'

import MdDelete from 'react-icons/lib/md/delete'

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
  FacebookShareButton,
  TwitterShareButton
} from 'ooni-components'

const supportedTests = [
  {
    key: 'web_connectivity',
    name: 'Web Connectivity'
  },
  {
    key: 'http_invalid_request_line',
    name: 'HTTP Invalid Request Line'
  },
  {
    key: 'http_header_field_manipulation',
    name: 'HTTP Header Field Manipulation'
  },
  {
    key: 'ndt',
    name: 'NDT Speed Test'
  },
  {
    key: 'dash',
    name: 'DASH Video Streaming'
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

export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedTest: 'web_connectivity',
      urls: [
        {value: 'http://', error: null}
      ],
      universalLink: getUniversalLink('web_connectivity'),
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
      state.universalLink = getUniversalLink(state.selectedTest, state.urls)
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
        state.universalLink = getUniversalLink(state.selectedTest, state.urls)
      }
      this.setState(state)
    })
  }

  handleChange(stateName) {
    return ((value, event) => {
      let state = Object.assign({}, this.state)
      const urls = this.state.urls.filter((url) => url !== '')
      state[stateName] = value
      state['universalLink'] = getUniversalLink(state.selectedTest, urls)
      this.setState(state)
    }).bind(this)
  }

  render() {
    const embedCode = `
    /* XXXX This is not real code!! */
    <a class='ooni-run-button'
        href='${this.state.universalLink}'>
      Run OONI!
    </a>
    <script>window.oonirnr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
        t = window.oonirnr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://jsdelivr.com/tmp.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    }(document, "script", "ooni-rnr"));</script>
    `
    return (
      <Layout>
        <Hero pb={4} pt={4}>
          <OONISubBrandRun />
          <HeroLead>Some inspiring call to action</HeroLead>
        </Hero>
        <Container pt={4}>
          <Row>

          <Column w={1/2}>
          <Heading f={2} pb={3}>Test Name</Heading>
      		<RadioGroup
              name='test_name'
              value={this.state.selectedTest}
              onChange={this.handleChange('selectedTest')}>
            {supportedTests.map(({key, name}) => (
              <RadioButton key={key} label={name} value={key} />
            ))}
          </RadioGroup>
          </Column>

          {this.state.selectedTest == 'web_connectivity'
          && <Column w={1/2}>
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
          </Column>}

          </Row>

          <Flex pt={3} pb={3} align='baseline' justify='space-around'>
            <Box>
              <Button onClick={this.toggleGenerate}>
                Generate
              </Button>
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
              <Overlay w={500}>
                <Container>
                  <Heading>You link is ready!</Heading>

                  <Heading pt={4} pb={2} f={3}>Share it on social media</Heading>
                  <Flex>
                  <Box pr={2}>
                    <TwitterShareButton
                      url={this.state.universalLink}
                      message='Run OONI Probe to test for censorship!'
                      />
                  </Box>
                  <Box pr={2}>
                    <FacebookShareButton
                      url={this.state.universalLink}
                      />
                  </Box>
                  </Flex>

                  <Heading pt={4} pb={2} f={3}>Share this URL with your friends</Heading>
                  <Input value={this.state.universalLink} />

                  <Heading pt={4} pb={2} f={3}>Or embed this code on your website</Heading>
                  <Input type='textarea' rows={10} value={embedCode} />

                  <Box pt={4}>
                  <Button onClick={this.toggleGenerate}>
                  Done
                  </Button>
                  </Box>

                </Container>
              </Overlay>
          </div>
        }
        </Container>
      </Layout>
    )
  }
}
