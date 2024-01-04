import { Box, Button, Flex, Input } from "ooni-components"
import { useCallback } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { FaRegTrashCan } from "react-icons/fa6"
import { FieldsPropTypes } from "./TestListForm"

const InputsFields = ({ name }: FieldsPropTypes) => {
	const { trigger, control } = useFormContext()
	const { fields, append, remove, insert, replace } = useFieldArray({
		name,
		control,
	})

	const onKeyPress = useCallback(
		(e: KeyboardEvent, index: number) => {
			if (e.key === "Enter") {
				e.preventDefault()
				append("", {
					shouldFocus: true,
					focusName: `${name}[${index + 1}]`,
				})
			}
		},
		[append, name],
	)

	const handlePaste = useCallback(
		(
			e: ClipboardEvent,
			index: number,
			onChange: (event: ClipboardEvent) => void,
		) => {
			// block the usual paste action
			e.preventDefault()

			const pastedText = e.clipboardData?.getData("Text")
			if (pastedText) {
				const newEntries = pastedText
					.split("\n")
					.filter((line: string) => line.length > 0)

				// Place first pasted entry into event and trigger onChange
				// This updates the field being pasted into with the first entry
				const eventTarget = e.target as HTMLInputElement
				eventTarget.value = newEntries[0]
				onChange(e)

				// Insert fields into the form using the rest of the entries
				insert(index + 1, newEntries.slice(1))

				// Trigger validation to show any errors in the new entries
				trigger()
			}
		},
		[insert, trigger],
	)

	return (
		<>
			{fields.map((item, index) => (
				<Box key={item.id} mt={3}>
					<Flex alignItems="center">
						<Box width="100%">
							<Controller
								key={`input-${item.id}`}
								render={({ field, fieldState }) => (
									<Input
										{...field}
										placeholder="https://twitter.com/"
										list="url-prefixes"
										onKeyPress={(e: KeyboardEvent) => onKeyPress(e, index)}
										onPaste={(e: ClipboardEvent) =>
											handlePaste(e, index, field.onChange)
										}
										error={fieldState?.error?.message}
									/>
								)}
								name={`${name}[${index}]`}
								control={control}
							/>
						</Box>
						<Box ml={2}>
							<Button
								variant="iconButton"
								type="button"
								onClick={() => remove(index)}
							>
								<FaRegTrashCan size={20} />
							</Button>
						</Box>
					</Flex>
				</Box>
			))}

			<Button
				mt={2}
				variant="link"
				type="button"
				onClick={() => {
					append("", { shouldFocus: true })
				}}
			>
				Add input +
			</Button>
		</>
	)
}

export default InputsFields