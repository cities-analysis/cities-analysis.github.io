import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Style from './Style'

function LinkDiv(props) {
    const { children, to, align } = props
    const navigate = useNavigate()

    const getPositioning = () => {
        switch (align) {
            case 'left':
                return Style.containerLeft
            case 'right':
                return Style.containerRight
            case 'center':
            default:
                return Style.container
        }
    }

    return (
        <div style={getPositioning()} onClick={() => navigate(to)}>
            {children}
        </div>
    )
}

LinkDiv.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    align: PropTypes.oneOf(['center', 'left', 'right']),
}

LinkDiv.defaultProps = {
    align: 'center',
}

export default LinkDiv
