import { Box, Button, Flex, Input, Modal } from "ooni-components"
import { useState } from "react"
import type { UseFormSetValue } from "react-hook-form"
import { useIntl } from "react-intl"
import type { TestList } from "./TestListForm"

const getInputsFromV1Link = (val: string) => {
  const url = new URL(val)
  if (url.hostname !== "run.ooni.io" && url.hostname !== "run.ooni.org")
    throw Error
  if (url.pathname !== "/nettest") throw Error
  if (!url.searchParams.get("ta")) throw Error
  return JSON.parse(url.searchParams.get("ta") || "")?.urls
}

type V1MigrationFieldProps = {
  nettests: Nettest[]
  setValue: UseFormSetValue<TestList>
  show: boolean
  onClose: () => void
}

const V1MigrationField = ({
  nettests,
  setValue,
  show,
  onClose,
}: V1MigrationFieldProps) => {
  const intl = useIntl()
  const [V1InputError, setV1InputError] = useState<null | string>(null)
  const migrateV1Link = (e: React.SyntheticEvent) => {
    e.preventDefault()
    // https://run.ooni.io/nettest?tn=web_connectivity&ta=%7B%22urls%22%3A%5B%22https%3A%2F%2Ftwitter.com%2F%22%2C%22https%3A%2F%2Ffacebook.cok%2F%22%5D%7D&mv=1.2.0
    const target = e.target as typeof e.target & {
      v1Link: { value: string }
    }

    try {
      const inputs = getInputsFromV1Link(target.v1Link.value)
      let updatedNettests = nettests
      if (nettests.some((n) => n.test_name === "web_connectivity")) {
        updatedNettests = nettests.map((n) => {
          if (n.test_name === "web_connectivity") {
            n.inputs = [...new Set([...n.inputs, ...inputs])]
          }
          return n
        })
      } else {
        updatedNettests.push({
          test_name: "web_connectivity",
          inputs,
          options: [],
          backend_options: [],
          is_background_run_enabled_default: false,
          is_manual_run_enabled_default: false,
        })
      }

      setValue("nettests", updatedNettests)
      onClose()
    } catch (e) {
      setV1InputError("Invalid URL")
    }
  }

  return (
    <Modal show={show} onHideClick={onClose} minWidth="800px">
      <Box p={4}>
        <form onSubmit={migrateV1Link} autoComplete="off">
          <Input
            name="v1Link"
            label={intl.formatMessage({ id: "MigrationModal.RunLink" })}
            error={V1InputError}
            onChange={() => setV1InputError(null)}
            mb={3}
          />
          <Flex justifyContent="end" sx={{ gap: 3 }}>
            <Button type="submit">
              {intl.formatMessage({ id: "MigrationModal.AddUrls" })}
            </Button>
            <Button hollow onClick={() => onClose()}>
              {intl.formatMessage({ id: "General.Cancel" })}
            </Button>
          </Flex>
        </form>
      </Box>
    </Modal>
  )
}

export default V1MigrationField
