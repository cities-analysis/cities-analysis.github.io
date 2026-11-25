import React, { PureComponent } from 'react'
import { Image, Space } from 'antd'
import Style from './Style'
import certImage from '../../images/DB_certificate.png'
import certImageSmall from '../../images/DB_certificate_small.png'

export const URL = window.location.origin

class Home extends PureComponent {
    render() {
        return (
            <div style={Style.home}>
                <Space direction='vertical'>
                    <h3 style={Style.description}>
                        Сравнительный потенциал креативной реиндустриализации городов второго
                        эшелона (на примере Свердловской, Челябинской, Кемеровской, Томской
                        областей, Алтайского края и Ханты-Мансийского автономного округов)
                    </h3>
                    <Image
                        width={300}
                        src={certImageSmall}
                        preview={{
                            src: certImage,
                        }}
                    />
                </Space>
            </div>
        )
    }
}

export default Home
