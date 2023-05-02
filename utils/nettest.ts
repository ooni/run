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

export const isIn = (k: string, a: string[]) => a.indexOf(k) !== -1

export const getTestType = (testName: string) => {
  if (isIn(testName, nnTestKeys)) {
    return 'Speed & Performance'
  }
  if (isIn(testName, mbTestKeys)) {
    return 'Middleboxes'
  }
  if (isIn(testName, cTestKeys)) {
    return 'Web Censorship'
  }
}
