import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { t } = useTranslation(['admin'])
  return (
    <div>
        <h1>{t('dashboard.title', { ns: 'admin' })}</h1>
        <h5>
          <Link to={'/shop'}>{t('dashboard.back_link', { ns: 'admin' })}</Link>
        </h5>
    </div>
  )
}

export default Dashboard
