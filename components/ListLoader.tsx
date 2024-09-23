import ContentLoader from 'react-content-loader'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Loader = (props: any) => (
  <ContentLoader
    speed={1}
    width={1248}
    height={593}
    viewBox="0 0 1248 593"
    backgroundColor="#f3f3f3"
    foregroundColor="#ECEBEB"
    {...props}
  >
    <rect width="1248" height="187" rx="5" fill="#ECEBEB" />
    <rect y="203" width="1248" height="187" rx="5" fill="#ECEBEB" />
    <rect y="406" width="1248" height="187" rx="5" fill="#ECEBEB" />
  </ContentLoader>
)

export default Loader
