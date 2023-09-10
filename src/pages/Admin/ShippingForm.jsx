import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js"
import {useStateContext} from "../../context/ContextProvider.jsx";

export default function ShippingForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [shipping, setshipping] = useState({
    id: null,
    name: '',
    price: null,
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/shipping/${id}`)
        .then(({data}) => {
          setLoading(false)
          setshipping(data)
          console.log(data);
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (shipping.id) {
      axiosClient.put(`/shipping/${shipping.id}`, shipping)
        .then(() => {
          setNotification('shipping was successfully updated')
          navigate('/shipping')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/shipping', shipping)
        .then((res) => {
          console.log(res);
          setNotification('shipping was successfully created')
          navigate('/shipping')
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
      {shipping.id && <h1>Update shipping: {shipping.name}</h1>}
      {!shipping.id && <h1>New shipping</h1>}
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
              value={shipping.name} 
              onChange={(e) => setshipping({
                ...shipping, 
                name: e.target.value
              })} 
              placeholder="Name"
            />
            <input 
              value={shipping.price} 
              onChange={(e) => setshipping({
                ...shipping, 
                price: Number.parseInt(e.target.value)
              })} placeholder="Price" 
            />
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
