import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js"
import {useStateContext} from "../../context/ContextProvider.jsx";

export default function TypeForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [types, settypes] = useState({
    id: null,
    name: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/types/${id}`)
        .then(({data}) => {
          setLoading(false)
          settypes(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (types.id) {
      axiosClient.put(`/types/${types.id}`, types)
        .then(() => {
          setNotification('types was successfully updated')
          navigate('/product-type')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/types', types)
        .then((res) => {
          setNotification('types was successfully created')
          navigate('/product-type')
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
      {types.id && <h1>Update types: {types.name}</h1>}
      {!types.id && <h1>New types</h1>}
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
            <input value={types.name} onChange={ev => settypes({...types, name: ev.target.value})} placeholder="Name"/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
