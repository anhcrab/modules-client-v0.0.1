import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js"
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function PaymentForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [bank, setBank] = useState([])
  const [store, setStore] = useState([])
  const [payment, setpayment] = useState({
    id: null,
    type: '',
    detail: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setNotification } = useStateContext()
  const { t } = useTranslation('admin')

  useEffect(() => {
    axiosClient.get('/banks').then(({data}) => setBank(data))
    axiosClient.get('/stores').then(({data}) => setStore(data))
  }, [])

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/payment/${id}`)
        .then(({ data }) => {
          setLoading(false)
          setpayment(data)
          console.log(data);
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (payment.id) {
      axiosClient.put(`/payment/${payment.id}`, payment)
        .then(() => {
          setNotification('payment was successfully updated')
          navigate('/payment')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/payment', payment)
        .then((res) => {
          console.log(res);
          setNotification('payment was successfully created')
          navigate('/payment')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {payment.id && <h1>{t('shop.payments.form.update')}: {payment.name}</h1>}
      {!payment.id && <h1>{t('shop.payments.form.new')}</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={payment.type}
              onChange={(e) => setpayment({
                ...payment,
                type: e.target.value
              })}
              placeholder={t('shop.payments.form.type')}
            />
            {payment.type === 'Banking' ? <select onChange={e => {
              let id = e.target.value
              console.log(id);
              let det
              bank.forEach(b => {
                if (b.id == id) {
                  det = b
                }
              })
              setpayment({...payment, detail: {
                bank_name: det.name,
                number: det.number
              }})
            }}>
              <option value={null}>{t('shop.payments.form.bank')}</option>
              {bank.map(b => <option value={b.id}>{b.name} --- {b.number}</option>)}
            </select> : ''}
            {/* --------- */}
            {payment.type === 'At Store' ? <select onChange={e => {
              let id = e.target.value
              let det
              store.forEach(s => {
                if (s.id == id) {
                  det = s
                }
              })
              setpayment({...payment, detail: {
                name: det.name,
                address: det.address
              }})
            }}>
              <option value={null}>{t('shop.payments.form.store')}</option>
              {store.map(s => <option value={s.id}>{s.name} --- {s.address}</option>)}
            </select> : ''}
            {/* ---------- */}
            {payment.type !== 'Banking' && payment.type !== 'At Store' ? <input
              value={payment.detail}
              onChange={(e) => setpayment({
                ...payment,
                detail: e.target.value
              })} placeholder={t('shop.payments.form.detail')}
            /> : ''}
            <br />
            <button className="btn">{t('shop.payments.form.save')}</button>
          </form>
        )}
      </div>
    </>
  )
}
