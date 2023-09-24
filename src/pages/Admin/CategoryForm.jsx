import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function CategoryForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [categories, setcategories] = useState({
    id: null,
    name: '',
    category_id: 0,
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
  const [parents, setParents] = useState([])
  const { t } = useTranslation('admin')

  useEffect(() => {
    axiosClient.get(`/categories`).then(res => setParents(res.data))
  }, [])

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/categories/${id}`)
        .then(({data}) => {
          setLoading(false)
          setcategories(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    console.log(categories);
    if (categories.id) {
      axiosClient.put(`/categories/${categories.id}`, categories)
        .then(() => {
          setNotification('categories was successfully updated')
          navigate('/product-category')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/categories', categories)
        .then((res) => {
          // setNotification('categories was successfully created')
          // navigate('/product-category')
          console.log(res.data);
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
      {categories.id && <h1>{t('product.categories.form.update')}: {categories.name}</h1>}
      {!categories.id && <h1>{t('product.categories.form.new')}</h1>}
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
            <input value={categories.name} onChange={ev => setcategories({...categories, name: ev.target.value})} placeholder={t('product.categories.form.name')}/>
            <select onChange={e => setcategories({...categories, category_id: Number.parseInt(e.target.value)})}>
              <option value={0}>{t('product.categories.form.choose')}</option>
              {parents.map(p => <option value={p.id}>
                {p.name}
              </option>)}
            </select>
            <br/>
            <button className="btn">{t('product.categories.form.save')}</button>
          </form>
        )}
      </div>
    </>
  )
}
