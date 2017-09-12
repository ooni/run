import Layout from '../components/Layout'

import { getUniversalLink } from '../utils/links'

import {
  Heading,
  Container,
  Label,
  Select,
  Input,
  Textarea,
  Button,
  Row,
  Column,
  Link,
  Pre
} from 'ooni-components'

export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedTest: 'web_connectivity',
      urls: '',
      universalLink: getUniversalLink('web_connectivity'),
      error: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(stateName) {
    return ((event) => {
      let state = Object.assign({}, this.state)
      const urls = this.state.urls.split('\n').filter((url) => url !== '')
      state[stateName] = event.target.value
      if (urls.length > 0) {
        if (!urls.every(url => url.startsWith('http'))) {
          state['error'] = 'urls must start with http'
        }
      }
      state['universalLink'] = getUniversalLink(state.selectedTest, urls)
      this.setState(state)
    }).bind(this)
  }

  render() {
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

    return (
      <Layout>
        <Container>
          <Heading>Run OONI!</Heading>
          <Row><Column>
          <Label>Test Name</Label>
          <Select value={this.state.selectedTest} onChange={this.handleChange('selectedTest')}>
            {/* Notice the lowercase options, yeah it's not a react component, just a vanilla option tag :P */}
            {supportedTests.map(({key, name}) => (
              <option value={key} key={key}>{name}</option>
            ))}
          </Select>
          </Column></Row>

          <Row><Column>
          {this.state.selectedTest == 'web_connectivity'
          && <div>
            <Label>URLs to test</Label>
            <Textarea rows={10} onChange={this.handleChange('urls')} value={this.state.urls}>
            </Textarea>
          </div>
          }
          </Column></Row>

          <Row>
          <Column w={2/3}>
            <Input value={this.state.universalLink} />
          </Column>

          <Column w={1/3}>
            <Link href={this.state.universalLink}>
            <Button>
            Click to run
            </Button>
            </Link>
          </Column>

          </Row>
        </Container>
      </Layout>
    )
  }
}
