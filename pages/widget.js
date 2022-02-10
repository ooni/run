import React from 'react'

import url from 'url'

import {
  Container,
  Button,
  IconButton,
  Link,
  Heading,
  Text,
  Flex,
  Box,
  Code
} from 'ooni-components'

import Layout from '../components/Layout'

import styled from 'styled-components'

import {
  getTestType
} from '../utils/nettest'

const StyledButtonWidget = styled(Button)`
  padding-top: 5px;
  height: 53px;
  padding-left: 5px;
  padding-right: 20px;
`

const ButtonWidget = (props) => (
  <a href={props.runLink} target='_parent'>
    <StyledButtonWidget>
      <img
        src='/static/images/ButtonOONI.png'
        srcSet='/static/images/ButtonOONI@2x.png 2x, /static/images/ButtonOONI@4x.png 4x'
      />
    </StyledButtonWidget>
  </a>
)

const StyledBannerContainer = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  width: 400px;
  background-color: ${props => props.theme.colors.base};
  color: ${props => props.theme.colors.white};
`

const Hr = styled.hr`
  margin: 0;
  border: 2px solid ${props => props.theme.colors.white};
  margin-bottom: 15px;
`

// XXX make this into the inverted class of the button
const BannerButton = styled(Button)`
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.base};

  &:hover {
    background-color: ${props => props.theme.colors.gray1};
  }

  &:active {
    transition: .2s ease-in;
    background-color: ${props => props.theme.colors.gray2};
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

const BannerWidget = (props) => (
  <StyledBannerContainer>
    <Container maxWidth={350}>
      <Heading h={2} center>{props.title}</Heading>
    </Container>
    <Hr />
    <Container maxWidth={350}>
      <Text center>Help take a stance against internet censorship and test for</Text>
      <Heading center h={5}>{props.testType}</Heading>
      <ButtonCenterContainer>
        <a href={props.runLink} target='_parent'>
          <BannerButton>
          Run OONI
          </BannerButton>
        </a>
      </ButtonCenterContainer>
      <PoweredBy>
        <Text>Powered By</Text>
        <a href='https://ooni.io/' target='_parent'>
          <img
            src='/static/images/ButtonOONI.png'
            srcSet='/static/images/ButtonOONI@2x.png 2x, /static/images/ButtonOONI@4x.png 4x'
          />
        </a>
      </PoweredBy>
    </Container>
  </StyledBannerContainer>
)

export default class extends React.Component {
  static async getInitialProps({ req, query }) {
    const widgetType = query.type || 'banner'
    const title = query.title || 'Fight Censorship'
    const runLink = query.link || 'https://run.ooni.io/'

    const u = url.parse(runLink, true)
    const testName = u.query.tn || 'web_connectivity'
    const testType = getTestType(testName)

    return {
      widgetType,
      title,
      runLink,
      testName,
      testType
    }
  }

  render() {
    const {
      widgetType,
      title,
      runLink,
      testType,
      testName
    } = this.props

    if (widgetType === 'banner') {
      return (
        <Layout>
          <BannerWidget testType={testType} title={title} runLink={runLink}/>
        </Layout>
      )
    }
    return (
      <Layout>
        <ButtonWidget title={title} runLink={runLink}/>
      </Layout>
    )
  }
}
