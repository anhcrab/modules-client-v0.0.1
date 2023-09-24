import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';
import ExportToCsv from '../../components/ExportToCsv';
import { useTranslation } from 'react-i18next';

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext()
  const { t } = useTranslation('admin')

  useEffect(() => {
    getTransactions();
  }, [])

  const onDeleteClick = product => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }
    axiosClient.delete(`/products/${product.id}`)
      .then(() => {
        setNotification('Product was successfully deleted')
        getTransactions()
      })
  }

  const getTransactions = () => {
    setLoading(true)
    axiosClient.get('/transaction')
      .then(({ data }) => {
        console.log(data);
        setLoading(false)
        setTransactions(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>{t('transactions.title')}</h1>
        <ExportToCsv className="btn-add" data={transactions} filename={`transaction_${new Date(Date.now()).toUTCString()}.csv`} />
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('transactions.table.order_id')}</th>
              <th>{t('transactions.table.intent')}</th>
              <th>{t('transactions.table.payer_id')}</th>
              <th>{t('transactions.table.name')}</th>
              <th>{t('transactions.table.country_code')}</th>
              <th>{t('transactions.table.email')}</th>
              <th>{t('transactions.table.status')}</th>
              <th>{t('transactions.table.date')}</th>
              <th>{t('transactions.table.actions')}</th>
            </tr>
          </thead>
          {loading &&
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
              {transactions && transactions.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.order_id}</td>
                  <td>{p.intent}</td>
                  <td>{p.payer_id}</td>
                  <td>{p.name}</td>
                  <td>{p.country_code}</td>
                  <td>{p.email}</td>
                  <td>{p.status}</td>
                  <td>{p.created_at}</td>
                  <td>
                    <button className="btn-delete" onClick={ev => onDeleteClick(p)}>{t('transactions.table.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
    </>
  )
}
