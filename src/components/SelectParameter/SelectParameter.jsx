import React, { PureComponent } from 'react'
import { Space, Typography, Select } from 'antd'
import PropTypes from 'prop-types'
import Style from './Style'
import { PARAMETERS } from '../../constants'

const { Text } = Typography

class SelectParameter extends PureComponent {
    render() {
        const { width, selectedParameter, onChangeSelectedParameter, includeCI, mode } = this.props
        const parameters = includeCI
            ? PARAMETERS
            : PARAMETERS.filter((parameter) => parameter.id.search('_ci') === -1)
        return (
            <Space direction='horizontal'>
                <Text style={Style.title}>
                    Параметр{Array.isArray(selectedParameter) ? 'ы' : ''}:
                </Text>
                <Select
                    style={{ ...Style.select, width }}
                    placeholder='Параметр'
                    mode={mode}
                    value={selectedParameter}
                    onChange={(parameter) => onChangeSelectedParameter(parameter)}
                    showSearch
                    filterOption={(input, option) =>
                        option?.label?.toString()?.toLowerCase()?.includes(input.toLowerCase())
                    }
                >
                    {parameters?.map((parameter) => (
                        <Select.Option
                            key={parameter.id}
                            value={parameter.id}
                            label={parameter.title}
                        >
                            {parameter.title}
                        </Select.Option>
                    ))}
                </Select>
            </Space>
        )
    }
}

SelectParameter.propTypes = {
    selectedParameter: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
        .isRequired,
    onChangeSelectedParameter: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    includeCI: PropTypes.bool,
    mode: PropTypes.string,
}

SelectParameter.defaultProps = {
    includeCI: true,
    mode: undefined,
}

export default SelectParameter
