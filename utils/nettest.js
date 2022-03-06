import {
  Text
} from 'ooni-components'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

export const messages = defineMessages({
  web_connectivity_name: {
    id: 'Test.WebConnectivity.Name',
    defaultMessage: 'Web Connectivity',
  },
  http_invalid_request_line_name: {
    id: 'Test.HTTPInValidRequestLine.Name',
    defaultMessage: 'HTTP Invalid Request Line'
  },
  http_header_field_manipulation_name: {
    id: 'Test.HTTPHeaderFieldManipulation.Name',
    defaultMessage: 'HTTP Header Field Manipulation'
  },
  ndt_name: {
    id: 'Test.NDT.Name',
    defaultMessage: 'NDT Speed Test'
  },
  dash_name: {
    id: 'Test.Dash.Name',
    defaultMessage: 'DASH Video Streaming'
  },
  web_connectivity_desc: {
    id: 'Test.WebConnectivity.Description',
    defaultMessage: 'Check if websites are blocked.'
  },
  http_invalid_request_line_desc: {
    id: 'Test.HTTPInValidRequestLine.Description',
    defaultMessage: 'Find middleboxes.'
  },
  http_header_field_manipulation_desc: {
    id: 'Test.HTTPHeaderFieldManipulation.Description',
    defaultMessage: 'Find middleboxes.'
  },
  ndt_desc: {
    id: 'Test.NDT.Description',
    defaultMessage: 'Measure the speed and performance of your network.'
  },
  dash_desc: {
    id: 'Test.Dash.Description',
    defaultMessage: 'Measure video streaming performance.'
  },
  nnText: {
    id: 'WhatCanYouDoText.NetNeutrality',
    defaultMessage:'Generate a link and share it with your friends and contacts around the world. Encourage them to run OONI Probe to measure the speed and performance of their networks!'
  },
  mbText: {
    id: 'WhatCanYouDoText.Middleboxes',
    defaultMessage:'Generate a link and share it with your friends and contacts around the world. Encourage them to run OONI Probe to find middleboxes in their networks!'
  },
  webText: {
    id: 'WhatCanYouDoText.WebCensorship',
    defaultMessage:'Generate a link and share it with your friends and contacts around the world. Encourage them to run OONI Probe to test the sites of your choice!'
  },
  genericText: {
    id: 'WhatCanYouDoText.Generic',
    defaultMessage:'Generate a link and share it with your friends and contacts around the world.'
  },
  learn: {
    id: 'Sidebar.Text.Learn',
    defaultMessage: 'Learn how this test works here'
  }
})

export const censorshipTests = [
  {
    key: 'web_connectivity',
    name: 'Web Connectivity',
    desc: 'Check if websites are blocked.',
    href: 'https://ooni.org/nettest/web-connectivity/'
  }
]
export const cTestKeys = censorshipTests.map(d => d.key)

export const middleBoxTests = [
  {
    key: 'http_invalid_request_line',
    name: 'HTTP Invalid Request Line',
    desc: 'Find middleboxes.',
    href: 'https://ooni.org/nettest/http-invalid-request-line/'
  },
  {
    key: 'http_header_field_manipulation',
    name: 'HTTP Header Field Manipulation.',
    desc: 'Find middleboxes',
    href: 'https://ooni.org/nettest/http-header-field-manipulation/'
  }
]
export const mbTestKeys = middleBoxTests.map(d => d.key)

export const netNeutralityTests = [
  {
    key: 'ndt',
    name: 'NDT Speed Test',
    desc: 'Measure the speed and performance of your network.',
    href: 'https://ooni.org/nettest/ndt/'
  },
  {
    key: 'dash',
    name: 'DASH Video Streaming',
    desc: 'Measure video streaming performance.',
    href: 'https://ooni.org/nettest/dash/'
  }
]
export const nnTestKeys = netNeutralityTests.map(d => d.key)

export const isIn = (k, a) => a.indexOf(k) !== -1

export const getTestType = testName => {
  if (isIn(testName, nnTestKeys)) {
    return <FormattedMessage id='Sidebar.Performance.Title' defaultMessage='Speed & Performance' />
  }
  if (isIn(testName, mbTestKeys)) {
    return <FormattedMessage id='Sidebar.Middleboxes.Title' defaultMessage='Middleboxes' />
  }
  if (isIn(testName, cTestKeys)) {
    return <FormattedMessage id='Sidebar.WebCensorship.Title' defaultMessage='Web Censorship' />
  }
}

export const WhatCanYouDoText = props => {
  const intl = useIntl()
  if (isIn(props.test, nnTestKeys)) {
    return <Text>{intl.formatMessage(messages.nnText)}</Text>
  }

  if (isIn(props.test, mbTestKeys)) {
    return <Text>{intl.formatMessage(messages.mbText)}</Text>
  }

  if (isIn(props.test, cTestKeys)) {
    return <Text>{intl.formatMessage(messages.webText)}</Text>
  }

  return <Text>{intl.formatMessage(messages.genericText)}</Text>
}
