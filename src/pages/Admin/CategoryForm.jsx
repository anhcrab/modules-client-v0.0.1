import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../context/ContextProvider.jsx";

export default function CategoryForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [categories, setcategories] = useState({
    id: null,
    name: '',
    category_id: null,
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
  const [parents, setParents] = useState([])

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
          setNotification('categories was successfully created')
          navigate('/product-category')
          console.log(res);
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
      {categories.id && <h1>Update categories: {categories.name}</h1>}
      {!categories.id && <h1>New categories</h1>}
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
            <input value={categories.name} onChange={ev => setcategories({...categories, name: ev.target.value})} placeholder="Name"/>
            <select onChange={e => setcategories({...categories, category_id: Number.parseInt(e.target.value)})}>
              <option value={null}>Choose parent category</option>
              {parents.map(p => <option value={p.id}>
                {p.name}
              </option>)}
            </select>
            <br/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
