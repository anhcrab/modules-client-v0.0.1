import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useTranslation } from "react-i18next";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

export default function AdvertForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [advert, setadvert] = useState({
    id: null,
    name: "",
    type: "",
    content: "",
    redirect_url: "",
    placements: "",
    style: "",
    images: null
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { t } = useTranslation("advert");

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/adverts/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setadvert(data);
          console.log(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  useEffect(() => {
    console.log(advert);
  }, [advert]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (advert.id) {
      axiosClient
        .post(`/adverts/${advert.id}`, advert)
        .then(() => {
          setNotification("advert was successfully updated");
          navigate("/advs");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      console.log(advert);
      axiosClient
        .post("/adverts", advert)
        .then((res) => {
          console.log(res);
          setNotification("advert was successfully created");
          navigate("/advs");
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
      {advert.id && (
        <h1>
          {t("update")}: {advert.name}
        </h1>
      )}
      {!advert.id && <h1>{t("new")}</h1>}
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append("id", advert.id);
              formData.append("name", advert.name);
              formData.append("type", advert.type);
              formData.append("content", advert.content);
              formData.append("redirect_url", advert.redirect_url);
              formData.append("placements", advert.placements);
              formData.append("style", advert.style);
              formData.append("images", advert.images);
              if (advert.id) {
                axiosClient
                  .post(`/adverts/${advert.id}`, formData, {
                    headers: { 'Accept': 'multipart/form-data' }
                  })
                  .then((res) => {
                    console.log(res.data);
                    setNotification("advert was successfully updated");
                    navigate("/advs");
                  })
                  .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                      setErrors(response.data.errors);
                    }
                  });
              } else {
                console.log(advert);
                axiosClient
                  .post("/adverts", formData, {
                    headers: { 'Accept': 'multipart/form-data' }
                  })
                  .then((res) => {
                    console.log(res);
                    setNotification("advert was successfully created");
                    navigate("/advs");
                  })
                  .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                      setErrors(response.data.errors);
                    }
                  });
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <input
              defaultValue={advert.name}
              onChange={(e) => setadvert({ ...advert, name: e.target.value })}
              placeholder={t("name")}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <select
                style={{
                  width: "50%",
                  outline: "none",
                  border: "2px solid #dedede",
                  color: "#444",
                  padding: "15px",
                }}
                onChange={(e) => setadvert({ ...advert, type: e.target.value })}
              >
                <option value={"html"} style={{ display: "none" }}>
                  {t("choose_type")}
                </option>
                <option value="html">HTML</option>
                <option value="image">Image</option>
              </select>
              <select
                style={{
                  width: "50%",
                  outline: "none",
                  border: "2px solid #dedede",
                  color: "#444",
                  padding: "15px",
                }}
                onChange={(e) =>
                  setadvert({ ...advert, placements: e.target.value })
                }
              >
                <option value={null} style={{ display: "none" }}>
                  {t("choose_place")}
                </option>
                <option value="full">Full</option>
                <option value="top">Top</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <input
              defaultValue={advert.redirect_url}
              onChange={(e) => setadvert({ ...advert, redirect_url: e.target.value })}
              placeholder={t("url")}
            />
            {advert.type === "image" ? (
              <input
                type="file"
                name="myImage"
                onChange={(event) => {
                  console.log(event.target.files[0]);
                  setadvert({ ...advert, images: event.target.files[0] });
                }}
              />
            ) : (
              <ReactQuill
                theme="snow"
                defaultValue={advert.content == null ? "" : advert.content}
                onChange={(e) => {
                  console.log(e);
                  setadvert({
                    ...advert,
                    content: e,
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
                placeholder={t("content")}
              />
            )}
            <textarea
              style={{
                height: "300px",
                marginTop: "50px",
                outline: "none",
                border: "2px solid #dedede",
                color: "#444",
                padding: "12px",
              }}
              placeholder={t("style")}
              onChange={e => setadvert({ ...advert, style: e.target.value })}
            ></textarea>
            <button className="btn" style={{ alignSelf: "flex-start" }}>
              {t("save")}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
