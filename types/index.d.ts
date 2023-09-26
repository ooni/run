declare module 'ooni-components'

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    LOCALES: string[]
  }
}

type Nettest = {
  test_name: string
  inputs: string[]
  options: {}[]
  backend_options: {}[]
  is_background_run_enabled: boolean
  is_manual_run_enabled: boolean
}

type Descriptor = {
  id: string
  name: string
  name_intl: {}[]
  author: string | undefined
  icon: string | undefined
  short_description: string | undefined
  short_description_intl: {}[]
  archived: boolean
  description: string | undefined
  description_intl: {}[]
  nettests: Nettest[]
  mine?: boolean
}

type DescriptorDetails = {
  descriptor: Descriptor
  descriptorCreationTime: string
  runLink: string
  deepLink: string
  archived: boolean | null
  linkId: string
}

type DescriptorPreview = {
  id: string
  author: string
  archived: boolean
  mine: boolean
  name: string
  short_description: string
}