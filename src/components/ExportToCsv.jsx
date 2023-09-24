import React from 'react'
import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next'

export default function ExportToCsv({ data, filename }) {
  const formatData = (data) => {
    let final = []
    data.forEach(i => {
      final.push({
        id: i.id,
        order_id: i.order_id,
        intent: i.intent,
        payer_id: i.payer_id,
        name: i.name,
        country: i.country_code,
        email: i.email,
        status: i.status,
        date: i.date
      })
    })
    return final
  }
  const { t } = useTranslation('export')
  return (
    <>
      <CSVLink className='btn-add' data={formatData(data)} filename={filename}>{t('title')}</CSVLink>
    </>
  )
}
