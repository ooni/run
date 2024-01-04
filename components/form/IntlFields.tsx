import { Box, Button, Flex, Input, Select } from "ooni-components"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { FaRegTrashCan } from "react-icons/fa6"
import styled from "styled-components"
import supportedLanguages from "../../utils/supportedLanguages"
import { FieldsPropTypes } from "./TestListForm"

const StyledLabel = styled.div`
label {
  font-size: 12px;
}
`

const langOptions = supportedLanguages.map((lang) => ({
	key: lang,
	name: new Intl.DisplayNames(["en"], { type: "language" }).of(
		lang.replace("_", "-"),
	),
}))

const IntlFields = ({ name }: FieldsPropTypes) => {
	const { control } = useFormContext()
	const { fields, append, remove } = useFieldArray({ name, control })
	return (
		<>
			{fields.map((item, index) => (
				<Box key={item.id} mt={3}>
					<Flex flexDirection={["column", "row"]}>
						<Box width={[1, 4 / 12]} mr={[0, 2]} pr={[28, 0]}>
							<Controller
								render={({ field }) => (
									<StyledLabel>
										<Select {...field} label="Language" width={1}>
											<option value="" />
											{langOptions.map(({ key, name }) => (
												<option key={key} value={key}>
													{name}
												</option>
											))}
										</Select>
									</StyledLabel>
								)}
								name={`${name}[${index}].key`}
								control={control}
							/>
						</Box>
						<Box width={[1, 8 / 12]}>
							<Flex flexDirection="row" mt={[2, 0]} alignItems="end">
								<Box width={1}>
									<Controller
										render={({ field }) => (
											<StyledLabel>
												<Input label="Translation" {...field} />
											</StyledLabel>
										)}
										name={`${name}[${index}].value`}
										control={control}
									/>
								</Box>
								<Button
									mb={12}
									ml={2}
									variant="iconButton"
									onClick={() => remove(index)}
								>
									<FaRegTrashCan size={20} />
								</Button>
							</Flex>
						</Box>
					</Flex>
				</Box>
			))}
			<Button
				mt={2}
				variant="link"
				type="button"
				onClick={() => {
					append({ key: "", value: "" })
				}}
			>
				Add translation +
			</Button>
		</>
	)
}

export default IntlFields
