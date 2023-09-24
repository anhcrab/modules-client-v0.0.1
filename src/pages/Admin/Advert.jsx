import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Advert() {
  const [adverts, setadverts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation("advert");

  useEffect(() => {
    getadvert();
  }, []);

  const onDeleteClick = (advert) => {
    if (!window.confirm("Are you sure you want to delete this advert?")) return;

    axiosClient.delete(`/adverts/${advert.id}`).then(() => {
      setNotification("advert was successfully deleted");
      getadvert();
    });
  };

  const getadvert = () => {
    setLoading(true);
    axiosClient
      .get("/adverts")
      .then(({ data }) => {
        setLoading(false);
        setadverts(data);
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
        <h1>{t("heading")}</h1>
        <Link className="btn-add" to="/advs/new">
          {t("add")}
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("name")}</th>
              <th>slug</th>
              <th>{t("type")}</th>
              <th>{t("url")}</th>
              <th>{t("placements")}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
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
              {adverts &&
                adverts.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.slug}</td>
                    <td>{u.type}</td>
                    <td>{u.redirect_url}</td>
                    <td>{u.placements}</td>
                    <td>
                      <select
                        style={{
                          width: "50%",
                          outline: "none",
                          border: "2px solid #dedede",
                          color: "#444",
                          padding: "10px",
                        }}
                        onChange={(e) => {
                          console.log('id: '+u.id+', status: '+e.target.value);
                          axiosClient
                            .put("/adverts/status/" + u.id, {
                              status: e.target.value
                            })
                            .then((res) => {
                              window.location.reload();
                            });
                        }}
                      >
                        <option value={u.status}>{u.status}</option>
                        <option
                          value={u.status === "draft" ? "publish" : "draft"}
                        >
                          {u.status === "draft" ? "publish" : "draft"}
                        </option>
                      </select>
                    </td>
                    <td>
                      <Link className="btn-edit" to={"/advs/" + u.id}>
                        {t("edit")}
                      </Link>
                      &nbsp;
                      <button
                        className="btn-delete"
                        onClick={() => onDeleteClick(u)}
                      >
                        {t("delete")}
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
