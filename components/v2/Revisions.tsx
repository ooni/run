import { Heading } from "ooni-components"
import RunLinkRevision from "./RunLinkRevisions"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Revisions = ({ revisionsList, linkId }: any) => {
  return (
    <>
      {!!revisionsList.length && (
        <>
          <Heading h={4}>Previous revisions</Heading>
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {revisionsList.map((item: any) => (
            <RunLinkRevision
              key={item.descriptor_creation_time}
              linkId={linkId}
              creationTime={item.descriptor_creation_time}
            />
          ))}
        </>
      )}
    </>
  )
}

export default Revisions
