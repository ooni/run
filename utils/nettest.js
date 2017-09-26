import {
  Text
} from 'ooni-components'

export const censorshipTests = [
  {
    key: 'web_connectivity',
    name: 'Web Connectivity',
    desc: 'Check if websites are blocked.',
    href: 'https://ooni.torproject.org/nettest/web-connectivity/'
  }
]
export const cTestKeys = censorshipTests.map(d => d.key)

export const middleBoxTests = [
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
export const mbTestKeys = middleBoxTests.map(d => d.key)

export const netNeutralityTests = [
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
export const nnTestKeys = netNeutralityTests.map(d => d.key)

export const isIn = (k, a) => a.indexOf(k) !== -1

export const getTestType = testName => {
  if (isIn(testName, nnTestKeys)) {
    return 'Network Neutrality'
  }
  if (isIn(testName, mbTestKeys)) {
    return 'Middleboxes'
  }
  if (isIn(testName, cTestKeys)) {
    return 'Web Censorship'
  }
}

export const WhatCanYouDoText = props => {
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


