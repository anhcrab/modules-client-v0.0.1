import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider.jsx";

export default function Shipping() {
  const [shipping, setshipping] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getshipping();
  }, [])

  const onDeleteClick = (shipping) => {
    if (!window.confirm("Are you sure you want to delete this shipping?")) return
    
    axiosClient.delete(`/shipping/${shipping.id}`)
      .then(() => {
        setNotification('shipping was successfully deleted')
        getshipping()
      })
  }

  const getshipping = () => {
    setLoading(true)
    axiosClient.get('/shipping')
      .then(({ data }) => {
        setLoading(false)
        setshipping(data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>shipping</h1>
        <Link className="btn-add" to="/shipping/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {shipping && shipping.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.price}</td>
                <td>
                  <Link className="btn-edit" to={'/shipping/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={() => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
