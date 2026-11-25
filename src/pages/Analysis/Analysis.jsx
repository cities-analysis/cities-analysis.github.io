import React, { PureComponent } from 'react'
import Style from './Style'

export const URL = 'analysis'

class Analysis extends PureComponent {
    render() {
        return (
            <div style={Style.analysis}>
                <p>Здесь будет регрессионный анализ</p>
            </div>
        )
    }
}

export default Analysis
