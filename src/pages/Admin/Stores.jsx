import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Stores() {
  const [stores, setstores] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation("admin");

  useEffect(() => {
    getstores();
  }, []);

  const onDeleteClick = (stores) => {
    if (!window.confirm("Are you sure you want to delete this stores?")) return;

    axiosClient.delete(`/stores/${stores.id}`).then(() => {
      setNotification("stores was successfully deleted");
      getstores();
    });
  };

  const getstores = () => {
    setLoading(true);
    axiosClient
      .get("/stores")
      .then(({ data }) => {
        setLoading(false);
        setstores(data);
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
        <h1>{t("shop.stores.title")}</h1>
        <Link className="btn-add" to="/stores/new">
          {t("shop.stores.table.add")}
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("shop.stores.table.name")}</th>
              <th>{t("shop.stores.table.address")}</th>
              <th>{t("shop.stores.table.actions")}</th>
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
              {stores &&
                stores.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.address}</td>
                    <td>
                      <Link className="btn-edit" to={"/stores/" + u.id}>
                        {t("shop.stores.table.edit")}
                      </Link>
                      &nbsp;
                      <button
                        className="btn-delete"
                        onClick={() => onDeleteClick(u)}
                      >
                        {t("shop.stores.table.delete")}
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
