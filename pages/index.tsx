import OONIRunHero from 'components/OONIRunHero'
import useUser from 'hooks/useUser'
import Markdown from 'markdown-to-jsx'
import NLink from 'next/link'
import { useIntl } from 'react-intl'

const StyledCard = ({ ...props }) => (
  <div {...props} className="border border-gray-400 rounded-lg h-full p-6" />
)

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const CardTitle = (props: any) => (
  <div className="text-base font-bold mb-4" {...props} />
)

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const CardText = (props: any) => (
  <div className="leading-[1.3]">
    <Markdown {...props} />
  </div>
)

const Home = () => {
  const intl = useIntl()
  const { user } = useUser()

  return (
    <>
      <OONIRunHero />
      <div className="container">
        <div className="max-w-[572px] mx-auto mt-10 mb-6 text-base lg:text-xl leading-6">
          <Markdown>{intl.formatMessage({ id: 'Home.About' })}</Markdown>
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3">
            <StyledCard>
              <CardTitle>
                {intl.formatMessage({ id: 'Home.Box1.Title' })}
              </CardTitle>
              <CardText>
                {intl.formatMessage({ id: 'Home.Box1.Description' })}
              </CardText>
            </StyledCard>
          </div>
          <div className="w-full lg:w-1/3">
            <StyledCard>
              <CardTitle>
                {intl.formatMessage({ id: 'Home.Box2.Title' })}
              </CardTitle>
              <CardText>
                {intl.formatMessage({ id: 'Home.Box2.Description' })}
              </CardText>
            </StyledCard>
          </div>
          <div className="w-full lg:w-1/3">
            <StyledCard>
              <CardTitle>
                {intl.formatMessage({ id: 'Home.Box3.Title' })}
              </CardTitle>
              <CardText>
                {intl.formatMessage({ id: 'Home.Box3.Description' })}
              </CardText>
            </StyledCard>
          </div>
        </div>
        <div className="text-center my-8">
          {user?.is_logged_in ? (
            <NLink href="/create" className="inline-block">
              <button
                className="btn btn-primary btn-lg text-base md:text-xl"
                type="button"
              >
                {intl.formatMessage({ id: 'Home.Button.CreateRunLink' })}
              </button>
            </NLink>
          ) : (
            <NLink href="/login" className="inline-block">
              <button
                className="btn btn-primary btn-lg text-base md:text-xl"
                type="button"
              >
                {intl.formatMessage({ id: 'Home.Button.Login' })}
              </button>
            </NLink>
          )}
        </div>
      </div>
    </>
  )
}

export default Home
