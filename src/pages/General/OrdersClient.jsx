import { useEffect, useState } from "react"
import ShopHeader from "../../components/ShopHeader"
import axiosClient from "../../axios-client"
import { Link } from "react-router-dom"

const OrderClient = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axiosClient.get(`/orders/${window.localStorage.getItem('device')}`)
      .then(({ data }) => {
        setOrders(data)
      })

  }, [])

  return (
    <>
      <ShopHeader />
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>

        <div style={{
          width: '1140px',
        }}>
          <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center", width: '1140px' }}>
            <h1>orders</h1>
          </div>
          <div className="card animated fadeInDown">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Items</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map(order => {
                  const products = JSON.parse(order.products)
                  return (
                    <>
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                          {products.map(product => {
                            return (
                              <>
                                <img
                                  src={product.images}
                                  alt="product-icon"
                                  style={{
                                    height: '60px',
                                    width: '60px',
                                  }}
                                />
                                <p>
                                  Tên: {product.name} | Giá: {product.price} | Số lượng: {product.quantity}
                                </p>
                              </>
                            )
                          })}
                        </td>
                        <td>{order.created_at}</td>
                        <td>{order.status}</td>
                      </tr>
                    </>
                  )
                })}
              </tbody>
            </table>
              Thích thông tin gì có thể thêm vào sau
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderClient