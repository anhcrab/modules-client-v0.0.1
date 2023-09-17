import React from "react";
import { useNavigate } from "react-router-dom";

export default function CouponsForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [coupons, setcoupons] = useState({
    id: null,
    name: "",
    category_id: 0,
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [parents, setParents] = useState([]);

  useEffect(() => {
    axiosClient.get(`/coupons`).then((res) => setParents(res.data));
  }, []);

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
          navigate("/product-category");
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
          // setNotification('coupons was successfully created')
          // navigate('/product-category')
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

  return (
    <>
      {coupons.id && <h1>Update coupons: {coupons.name}</h1>}
      {!coupons.id && <h1>New coupons</h1>}
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
              value={coupons.name}
              onChange={(ev) =>
                setcoupons({ ...coupons, name: ev.target.value })
              }
              placeholder="Name"
            />
            <select
              onChange={(e) =>
                setcoupons({
                  ...coupons,
                  category_id: Number.parseInt(e.target.value),
                })
              }
            >
              <option value={0}>Choose parent category</option>
              {parents.map((p) => (
                <option value={p.id}>{p.name}</option>
              ))}
            </select>
            <br />
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
