import { URL } from 'url'

import { Container, Button, Heading, Text } from 'ooni-components'

import styled from 'styled-components'
import { GetServerSideProps } from 'next'

import { getTestType } from '../utils/nettest'

const StyledButtonWidget = styled(Button)`
  padding-top: 5px;
  height: 53px;
  padding-left: 5px;
  padding-right: 20px;
`
type ButtonWidgetProps = { runLink: string }

const ButtonWidget = ({ runLink }: ButtonWidgetProps) => (
  <a href={runLink} target="_parent">
    <StyledButtonWidget>
      <img
        alt=""
        src="/static/images/ButtonOONI.png"
        srcSet="/static/images/ButtonOONI@2x.png 2x, /static/images/ButtonOONI@4x.png 4x"
      />
    </StyledButtonWidget>
  </a>
)

const StyledBannerContainer = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  width: 400px;
  background-color: ${(props) => props.theme.colors.base};
  color: ${(props) => props.theme.colors.white};
`

const Hr = styled.hr`
  margin: 0;
  border: 2px solid ${(props) => props.theme.colors.white};
  margin-bottom: 15px;
`

// XXX make this into the inverted class of the button
const BannerButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.base};

  &:hover {
    background-color: ${(props) => props.theme.colors.gray1};
  }

  &:active {
    transition: 0.2s ease-in;
    background-color: ${(props) => props.theme.colors.gray2};
  }
`

const ButtonCenterContainer = styled.div`
  padding-top: 15px;
  text-align: center;
`

const PoweredBy = styled.div`
  padding-top: 15px;
  text-align: center;

  img {
    vertical-align: middle;
  }

  img:hover {
    opacity: 0.9;
  }

  p {
    display: inline;
    padding-right: 10px;
  }
`
type BannerWidgetProps = {
  title: string
  testType: string
  runLink: string
}

const BannerWidget = ({ title, testType, runLink }: BannerWidgetProps) => (
  <StyledBannerContainer>
    <Container maxWidth={350}>
      <Heading h={2} center>
        {title}
      </Heading>
    </Container>
    <Hr />
    <Container maxWidth={350}>
      <Text center>
        Help take a stance against internet censorship and test for
      </Text>
      <Heading center h={5}>
        {testType}
      </Heading>
      <ButtonCenterContainer>
        <a href={runLink} target="_parent">
          <BannerButton>Run OONI</BannerButton>
        </a>
      </ButtonCenterContainer>
      <PoweredBy>
        <Text>Powered By</Text>
        <a href="https://ooni.io/" target="_parent">
          <img
            src="/static/images/ButtonOONI.png"
            srcSet="/static/images/ButtonOONI@2x.png 2x, /static/images/ButtonOONI@4x.png 4x"
          />
        </a>
      </PoweredBy>
    </Container>
  </StyledBannerContainer>
)

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const widgetType = query.type || 'banner'
  const title = query.title || 'Fight Censorship'
  const runLink = Array.isArray(query.link)
    ? query.link[0]
    : query.link || 'https://run.ooni.io/'

  const u = new URL(runLink)
  const testName = u.searchParams.get('tn') || 'web_connectivity'
  const testType = getTestType(testName)

  return {
    props: {
      widgetType,
      title,
      runLink,
      testName,
      testType,
    },
  }
}

type WidgetProps = {
  widgetType: string
  title: string
  runLink: string
  testType: string
}

const Widget = ({ widgetType, title, runLink, testType }: WidgetProps) => {
  if (widgetType === 'banner') {
    return <BannerWidget testType={testType} title={title} runLink={runLink} />
  }
  return <ButtonWidget runLink={runLink} />
}

export default Widget
