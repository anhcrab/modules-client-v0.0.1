import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Payment() {
  const [payment, setpayment] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation("admin");

  useEffect(() => {
    getpayment();
  }, []);

  const onDeleteClick = (payment) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;

    axiosClient.delete(`/payment/${payment.id}`).then(() => {
      setNotification("payment was successfully deleted");
      getpayment();
    });
  };

  const getpayment = () => {
    setLoading(true);
    axiosClient
      .get("/payment")
      .then(({ data }) => {
        console.log(data);
        setLoading(false);
        setpayment(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const renderDetail = (detail) => {
    detail = JSON.parse(detail);
    if (detail === null) return "";
    if (typeof detail === "string") return detail;
    if (detail.bank_name) return detail.bank_name + " " + detail.number;
    if (detail.name) return detail.name + " " + detail.address;
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
        <h1>{t("shop.payments.title")}</h1>
        <Link className="btn-add" to="/payment/new">
          {t("shop.payments.table.add")}
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("shop.payments.table.type")}</th>
              <th>{t("shop.payments.table.detail")}</th>
              <th>{t("shop.payments.table.actions")}</th>
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
              {payment &&
                payment.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.type}</td>
                    <td>{renderDetail(u.detail)}</td>
                    <td>
                      <Link className="btn-edit" to={"/payment/" + u.id}>
                        {t("shop.payments.table.edit")}
                      </Link>
                      &nbsp;
                      <button
                        className="btn-delete"
                        onClick={() => onDeleteClick(u)}
                      >
                        {t("shop.payments.table.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
