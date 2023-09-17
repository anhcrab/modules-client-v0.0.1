import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    setDisplayOrders(orders);
  }, [orders]);

  const getOrders = () => {
    setLoading(true);
    axiosClient
      .get("/orders")
      .then(({ data }) => {
        console.log(data);
        setLoading(false);
        setOrders(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>orders</h1>
        <Link className="btn-add" to="/orders/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <div
              style={{
                margin: "15px 0",
              }}
            >
              <select defaultValue={'default'}
                onChange={(e) => {
                  const date = new Date(Date.now());
                  const select = e.target.value;
                  const res = [];
                  switch (select) {
                    case "sort-by-date":
                      orders.forEach((order) => {
                        const order_day = new Date(order.created_at).getDate();
                        if (order_day === date.getDate()) {
                          res.push(order);
                        }
                      });
                      setDisplayOrders(res);
                      break;
                    case "sort-by-month":
                      orders.forEach((order) => {
                        const order_day = new Date(order.created_at).getMonth();
                        if (order_day === date.getMonth()) {
                          res.push(order);
                        }
                      });
                      setDisplayOrders(res);
                      break;
                    case "sort-by-year":
                      orders.forEach((order) => {
                        const order_day = new Date(
                          order.created_at
                        ).getFullYear();
                        if (order_day === date.getFullYear()) {
                          res.push(order);
                        }
                      });
                      setDisplayOrders(res);
                      break;
                    default:
                      setDisplayOrders(orders);
                      break;
                  }
                }}
              >
                <option
                  value='default'
                  style={{
                    display: "none",
                  }}
                >
                  Thống kê theo
                </option>
                <option value="sort-by-date">Theo Ngày</option>
                <option value="sort-by-month">Theo Tháng</option>
                <option value="sort-by-year">Theo Năm</option>
              </select>
            </div>
            <tr>
              <th>ID</th>
              <th>Items</th>
              <th>Full Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>date</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {orders &&
                displayOrders.map((order) => {
                  const products = JSON.parse(order.products);
                  return (
                    <>
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                          {products.map((product) => {
                            return (
                              <>
                                <img
                                  src={product.images}
                                  alt="product-icon"
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                  }}
                                />
                                <p>
                                  Tên: {product.name} | Giá: {product.price} |
                                  Số lượng: {product.quantity}
                                </p>
                              </>
                            );
                          })}
                        </td>
                        <td>{order.fullname}</td>
                        <td>{order.address}</td>
                        <td>{order.phone}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>{order.status}</td>
                        <td>
                          <select
                            onChange={(e) => {
                              if (e.target.value === "return") {
                              }
                              axiosClient
                                .put("/orders/" + order.id, {
                                  status: e.target.value,
                                })
                                .then((res) => {
                                  console.log(res);
                                  window.location.reload();
                                });
                            }}
                          >
                            <option value={null} style={{ display: "none" }}>
                              choose status
                            </option>
                            <option value="accepted">accepted</option>
                            <option value="proccessing">proccessing</option>
                            <option value="packaging">packaging</option>
                            <option value="delivering">delivering</option>
                            <option value="returned">returned</option>
                            <option value="received">received</option>
                          </select>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Orders;
