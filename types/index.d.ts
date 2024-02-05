declare module "ooni-components"
declare module "ooni-components/icons"

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    LOCALES: string[]
  }
}

type Nettest = {
  test_name: string
  inputs: string[]
  options: object[]
  backend_options: object[]
  is_background_run_enabled: boolean
  is_manual_run_enabled: boolean
}

type Descriptor = {
  ooni_run_link_id: string
  name: string
  name_intl: object[]
  author: string | undefined
  icon: keyof typeof icons | undefined
  short_description: string | undefined
  short_description_intl: object[]
  archived: boolean
  description: string | undefined
  description_intl: object[]
  nettests: Nettest[]
  mine?: boolean
  descriptor_creation_time: string
  expiration_date: string
}

type DescriptorView = {
  descriptor: Descriptor
  descriptorCreationTime: string
  runLink: string
  deepLink?: string
  archived: boolean | null
  linkId: string
}

type RevisionView = {
  descriptor: Descriptor
  descriptorCreationTime: string
  archived: boolean | null
  linkId: string
}
