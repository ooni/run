import DescriptorCard from './DescriptorCard'

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
