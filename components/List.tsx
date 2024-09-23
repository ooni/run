import DescriptorCard from './DescriptorCard'

// const StyledGrid = styled(Box)`
// display: grid;
// grid-template-columns: 1fr;
// grid-auto-rows: 1fr;
// gap: 16px 24px;
// @media (min-width: 800px) {
//   grid-template-columns: 1fr 1fr;
// }
// `

type ListProps = {
  runLinks: Descriptor[]
}

const List = ({ runLinks }: ListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
      {runLinks?.map((desc) => (
        <DescriptorCard descriptor={desc} key={desc.oonirun_link_id} />
      ))}
    </div>
  )
}

export default List
