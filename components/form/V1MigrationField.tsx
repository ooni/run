import { Box, Button, Flex, Input, Modal } from "ooni-components"
import { useState } from "react"
import type { FieldValues, UseFormSetValue } from "react-hook-form"
import { useIntl } from "react-intl"

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
  setValue: UseFormSetValue<FieldValues>
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
  const [inputValue, setInputValue] = useState("")
  const migrateV1Link = () => {
    // https://run.ooni.io/nettest?tn=web_connectivity&ta=%7B%22urls%22%3A%5B%22https%3A%2F%2Ftwitter.com%2F%22%2C%22https%3A%2F%2Ffacebook.cok%2F%22%5D%7D&mv=1.2.0

    try {
      const inputs = getInputsFromV1Link(inputValue)
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
        <Input
          name="v1Link"
          label={intl.formatMessage({ id: "MigrationModal.RunLink" })}
          error={V1InputError}
          value={inputValue}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setInputValue(e.currentTarget.value)
            setV1InputError(null)
          }}
          mb={3}
        />
        <Flex justifyContent="end" sx={{ gap: 3 }}>
          <Button onClick={() => migrateV1Link()}>
            {intl.formatMessage({ id: "MigrationModal.AddUrls" })}
          </Button>
          <Button hollow onClick={() => onClose()}>
            {intl.formatMessage({ id: "General.Cancel" })}
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}

export default V1MigrationField
