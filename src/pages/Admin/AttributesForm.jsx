import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js"
import {useStateContext} from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function AttributesForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [attributes, setattributes] = useState({
    id: null,
    type: null,
    name: '',
    code: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
  const { t } = useTranslation('admin')

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/attributes/${id}`)
        .then(({data}) => {
          setLoading(false)
          setattributes(data)
          console.log(data);
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (attributes.id) {
      axiosClient.put(`/attributes/${attributes.id}`, attributes)
        .then(() => {
          setNotification('attributes was successfully updated')
          navigate('/attributes')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/attributes', attributes)
        .then((res) => {
          console.log(res);
          setNotification('attributes was successfully created')
          navigate('/attributes')
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
      {attributes.id && <h1>{t('product.attributes.form.update')}: {attributes.name}</h1>}
      {!attributes.id && <h1>{t('product.attributes.form.new')}</h1>}
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
            <select value={attributes.type} onChange={e => setattributes({...attributes, type: e.target.value})}>
              <option value={null}>{t('product.attributes.form.type')}</option>
              <option value="size">Size</option>
              <option value="color">Color</option>
            </select>
            <input value={attributes.name} onChange={(e) => setattributes({...attributes, name: e.target.value})} placeholder={t('product.attributes.form.name')} />
            <input value={attributes.code} onChange={(e) => setattributes({...attributes, code: e.target.value})} placeholder={t('product.attributes.form.code')} />
            <button className="btn">{t('product.attributes.form.save')}</button>
          </form>
        )}
      </div>
    </>
  )
}
