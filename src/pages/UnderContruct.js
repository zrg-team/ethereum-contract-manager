import React, { Fragment } from 'react'
import I18n from 'i18n-js'
import Loading from '../common/components/widgets/Loading'

class UnderContruct extends React.Component {
  render () {
    return (
      <Fragment>
        <Loading />
        <p style={{
          position: 'absolute',
          fontSize: 30,
          fontWeight: 'bold'
        }}>{I18n.t('common.under_contruct').toUpperCase()}</p>
      </Fragment>
    )
  }
}

export default UnderContruct
