import * as Sentry from "@sentry/nextjs"
import type { NextPageContext } from "next"
import NextError from "next/error"

const CustomErrorComponent = ({ statusCode }: { statusCode: number }) => {
  return <NextError statusCode={statusCode} />
}

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData)

  // This will contain the status code of the response
  return NextError.getInitialProps(contextData)
}

export default CustomErrorComponent
