import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
  ],
};

export default function CouponsForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [coupons, setcoupons] = useState({
    id: null,
    code: "",
    name: "",
    description: "",
    max_uses: null,
    max_uses_user: null,
    type: "",
    discount_amount: null,
    min_amount: null,
    status: null,
    starts_at: "",
    expires_at: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation("admin");

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/coupons/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setcoupons(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    console.log(coupons);
    if (coupons.id) {
      axiosClient
        .put(`/coupons/${coupons.id}`, coupons)
        .then(() => {
          setNotification("coupons was successfully updated");
          navigate("/coupons");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/coupons", coupons)
        .then((res) => {
          setNotification("coupons was successfully created");
          navigate("/coupons");
          console.log(res.data);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const handleOnChange = (e) => {
    setcoupons({
      ...coupons,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log(coupons);
  }, [coupons]);

  return (
    <>
      {coupons.id && (
        <h1>
          {t("coupons.form.update")}: {coupons.name}
        </h1>
      )}
      {!coupons.id && <h1>{t("coupons.form.new")}</h1>}
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
              defaultValue={coupons.code}
              onChange={handleOnChange}
              placeholder={t("coupons.form.code")}
              name="code"
            />
            <input
              defaultValue={coupons.name}
              onChange={handleOnChange}
              placeholder={t("coupons.form.name")}
              name="name"
            />
            <input
              defaultValue={coupons.max_uses}
              onChange={handleOnChange}
              placeholder={t("coupons.form.max_uses")}
              name="max_uses"
            />
            <input
              defaultValue={coupons.max_uses_user}
              onChange={handleOnChange}
              placeholder={t("coupons.form.max_uses_user")}
              name="max_uses_user"
            />
            <input
              defaultValue={coupons.type}
              onChange={handleOnChange}
              placeholder={t("coupons.form.type")}
              name="type"
            />
            <input
              defaultValue={coupons.discount_amount}
              onChange={handleOnChange}
              placeholder={t("coupons.form.discount")}
              name="discount_amount"
            />
            <input
              defaultValue={coupons.min_amount}
              onChange={handleOnChange}
              placeholder={t("coupons.form.min")}
              name="min_amount"
            />
            <input
              defaultValue={coupons.status}
              onChange={handleOnChange}
              placeholder={t("coupons.form.status")}
              name="status"
            />
            <input
              defaultValue={coupons.starts_at}
              onChange={handleOnChange}
              placeholder={t("coupons.form.starts")}
              name="starts_at"
              type="date"
            />
            <input
              defaultValue={coupons.expires_at}
              onChange={handleOnChange}
              placeholder={t("coupons.form.expires")}
              name="expires_at"
              type="date"
            />
            <ReactQuill
              theme="snow"
              defaultValue={coupons.description}
              onChange={(e) => {
                setcoupons({
                  ...coupons,
                  description: e,
                });
              }}
              modules={modules}
              style={{
                display: "inline-block",
                width: "100%",
                height: `500px`,
                marginTop: "10px",
                transition: "all 0.3s",
              }}
              placeholder={t("coupons.form.description")}
            />
            <br />
            <button className="btn">{t("coupons.form.save")}</button>
          </form>
        )}
      </div>
    </>
  );
}
