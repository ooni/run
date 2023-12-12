import { Heading } from "ooni-components"
import RunLinkRevision from "./RunLinkRevisions"

const Revisions = ({ revisionsList, linkId }: any) => {
  return (
    <>
      {!!revisionsList.length && (
        <>
          <Heading h={4}>Previous revisions</Heading>
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