import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import ExportToCsv from '../../components/ExportToCsv.jsx'
import { useTranslation } from "react-i18next";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation('admin')

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
        <h1>{t('orders.title')}</h1>
        <ExportToCsv className="btn-add" data={orders} filename={`transaction_${new Date(Date.now()).toUTCString()}.csv`} />
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
                  {t('orders.table.sort.head')}
                </option>
                <option value="sort-by-date">{t('orders.table.sort.day')}</option>
                <option value="sort-by-month">{t('orders.table.sort.month')}</option>
                <option value="sort-by-year">{t('orders.table.sort.year')}</option>
              </select>
            </div>
            <tr>
              <th>ID</th>
              <th>{t('orders.table.items')}</th>
              <th>{t('orders.table.total_price')}</th>
              <th>{t('orders.table.fullname')}</th>
              <th>{t('orders.table.address')}</th>
              <th>{t('orders.table.phone')}</th>
              <th>{t('orders.table.date')}</th>
              <th>{t('orders.table.status')}</th>
              <th>{t('orders.table.update')}</th>
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
                        <td>{order.total_price}</td>
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
