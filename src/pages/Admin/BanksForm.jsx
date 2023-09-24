import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

export default function BanksForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [banks, setbanks] = useState({
    id: null,
    name: "",
    number: null,
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation("admin");

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/banks/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setbanks(data);
          console.log(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (banks.id) {
      axiosClient
        .put(`/banks/${banks.id}`, banks)
        .then(() => {
          setNotification("banks was successfully updated");
          navigate("/banks");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/banks", banks)
        .then((res) => {
          console.log(res);
          setNotification("banks was successfully created");
          navigate("/banks");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {banks.id && (
        <h1>
          {t("shop.banks.form.update")}: {banks.name}
        </h1>
      )}
      {!banks.id && <h1>{t("shop.banks.form.new")}</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={banks.name}
              onChange={(e) => setbanks({ ...banks, name: e.target.value })}
              placeholder={t("shop.banks.form.name")}
            />
            <input
              value={banks.number}
              onChange={(e) => setbanks({ ...banks, number: e.target.value })}
              placeholder={t("shop.banks.form.number")}
            />
            <button className="btn">{t("shop.banks.form.save")}</button>
          </form>
        )}
      </div>
    </>
  );
}
