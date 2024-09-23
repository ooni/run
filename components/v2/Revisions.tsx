import Link from 'next/link'
import { useIntl } from 'react-intl'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Revisions = ({ length, linkId }: any) => {
  const intl = useIntl()
  const revisionsLength = length - 1

  return (
    <>
      {!!revisionsLength && (
        <>
          <h4>{intl.formatMessage({ id: 'Revisions.Title' })}</h4>
          {[...Array(revisionsLength).keys()].reverse().map((i) => (
            <div className="mb-4" key={i}>
              <Link
                className="underline"
                href={`/revisions/${linkId}?revision=${i + 1}`}
              >
                v{i + 1}
              </Link>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default Revisions
