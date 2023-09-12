import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js"
import {useStateContext} from "../../context/ContextProvider.jsx";

export default function storesForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [stores, setstores] = useState({
    id: null,
    name: '',
    address: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/stores/${id}`)
        .then(({data}) => {
          setLoading(false)
          setstores(data)
          console.log(data);
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (stores.id) {
      axiosClient.put(`/stores/${stores.id}`, stores)
        .then(() => {
          setNotification('stores was successfully updated')
          navigate('/stores')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/stores', stores)
        .then((res) => {
          console.log(res);
          setNotification('stores was successfully created')
          navigate('/stores')
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
      {stores.id && <h1>Update stores: {stores.name}</h1>}
      {!stores.id && <h1>New stores</h1>}
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
            <input value={stores.name} onChange={(e) => setstores({...stores, name: e.target.value})} placeholder="Name"/>
            <input value={stores.address} onChange={(e) => setstores({...stores, address: e.target.value})} placeholder="Address" />
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
