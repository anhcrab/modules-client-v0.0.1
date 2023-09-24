import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation(["contact", "admin"]);

  useEffect(() => {
    getContacts();
  }, []);

  const onDeleteClick = (contact) => {
    if (!window.confirm("Are you sure you want to delete this contacts?"))
      return;

    axiosClient.delete(`/contacts/${contact.id}`).then(() => {
      setNotification("Contacts was successfully deleted");
      getContacts();
    });
  };

  const getContacts = () => {
    setLoading(true);
    axiosClient
      .get("/contacts")
      .then(({ data }) => {
        setLoading(false);
        setContacts(data);
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
        <h1>{t("contact", { ns: "admin" })}</h1>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("table.name")}</th>
              <th>{t("table.email")}</th>
              <th>{t("table.phone")}</th>
              <th>{t("table.subject")}</th>
              <th>{t("table.message")}</th>
              <th>{t("table.clear")}</th>
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
              {contacts &&
                contacts.map((u) => {
                  if (u.is_cleared == 1) {
                    return "";
                  }
                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.firstname + " " + u.lastname}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.subject}</td>
                      <td>{u.message}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => onDeleteClick(u)}
                        >
                          {t("table.clear")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
