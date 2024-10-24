import { cloneElement, useState, type ReactElement } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { testGroups, testNames } from 'utils/test-info'

type NettestsInputsProps = {
  inputs: string[]
}

const NettestsInputs = ({ inputs }: NettestsInputsProps) => {
  const intl = useIntl()
  const [collapsed, setCollapsed] = useState(false)
  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="text-xs font-bold my-2 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {intl.formatMessage({ id: 'TestListForm.NettestFields.Urls' })} (
        {inputs.length}){' '}
        <span className="inline-block ml-4">
          {collapsed ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </span>
      </div>
      <div
        className={`text-sm ${!collapsed && 'text-ellipsis h-[20px] overflow-hidden whitespace-nowrap'}`}
      >
        {inputs.join(', ')}
      </div>
    </>
  )
}

type NettestsBoxProps = {
  nettests: Nettest[]
}

const NettestsBox = ({ nettests }: NettestsBoxProps) => {
  const intl = useIntl()
  const getIconComponent = (icon: ReactElement | undefined) =>
    icon ? cloneElement(icon, { size: '20' }) : null

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h4 className="my-0">
        {intl.formatMessage({ id: 'TestListForm.AdminNettests.Tests' })}
      </h4>
      {nettests.map((nettest, i) => (
        <div
          className={`flex flex-col py-2 ${i > 0 && 'border-t border-gray-300'}`}
          key={`${nettest.test_name}-${i}`}
        >
          <div className="flex items-center">
            {testNames[nettest.test_name]?.group && (
              <div
                className="mr-2"
                style={{
                  color: testGroups[testNames[nettest.test_name].group].color,
                }}
              >
                {getIconComponent(
                  testGroups[testNames[nettest.test_name].group].icon,
                )}
              </div>
            )}
            {testNames[nettest.test_name]?.name ? (
              <div className="font-semibold">
                {testNames[nettest.test_name].name}
              </div>
            ) : (
              <div className="font-semibold">{nettest.test_name}</div>
            )}
          </div>
          {!!nettest.inputs?.length && (
            <NettestsInputs inputs={nettest.inputs} />
          )}
        </div>
      ))}
    </div>
  )
}

export default NettestsBox
