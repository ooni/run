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
  oonirun_link_id: string
  name: string
  name_intl: object[]
  author: string | undefined
  icon: keyof typeof icons | undefined
  short_description: string | undefined
  short_description_intl: object[]
  is_expired: boolean
  description: string | undefined
  description_intl: object[]
  nettests: Nettest[]
  is_mine?: boolean
  date_updated: string
  date_created: string
  expiration_date: string
  revision: number
  first_revision_date_created: string
}

type DescriptorView = {
  descriptor: Descriptor
  runLink: string
  deepLink?: string
  linkId: string
}

type RevisionView = {
  descriptor: Descriptor
  linkId: string
}
