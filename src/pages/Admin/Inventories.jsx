import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
// import img from '../assets/logo-pis.png'

const Inventories = () => {
  const [inventories, setinventories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [choices, setChoices] = useState({
    type: "",
    category: "",
    size: "",
    color: "",
  });
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getinventories();
    axiosClient.get("/types").then(({ data }) => setTypes(data));
    axiosClient.get("/categories").then(({ data }) => setCategories(data));
    axiosClient.get("/attributes").then(({ data }) => setAttributes(data));
  }, []);

  const onDeleteClick = (product) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    axiosClient.delete(`/products/${product.id}`).then(() => {
      setNotification("Product was successfully deleted");
      getinventories();
    });
  };

  const getinventories = () => {
    setLoading(true);
    axiosClient
      .get("/products")
      .then(({ data }) => {
        console.log(data);
        setLoading(false);
        setinventories(data);
        setFiltered(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const filter = (list) => {
    // if (choices.type === null && choices.category && choices.size === null && choices.color === null) return list
    if (choices.type !== "") {
      list = list.filter((item) => {
        return choices.type == item.type;
      });
    }
    if (choices.category !== "") {
      list = list.filter((item) => {
        return choices.category == item.category;
      });
    }

    if (choices.size !== "") {
      list = list.filter((item) => {
        return item.attributes.filter((a) => a.name == choices.size);
      });
    }

    if (choices.color !== "") {
      list = list.filter((item) => {
        return item.attributes.filter((a) => a.name == choices.color);
      });
    }

    if (document.getElementById("best-seller").checked) {
      list = list.sort((f, s) => {
        return f.total_sale - s.total_sale;
      });
    }

    console.log("list: ", list);
    return list;
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
        <h1>Inventories</h1>
        {/* <Link className="btn-add" to="/inventories/new">Add new</Link> */}
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr style={{ backgroundColor: "white" }}>
              <th style={{ backgroundColor: "white" }}>
                <select
                  onChange={(e) =>
                    setChoices({ ...choices, type: e.target.value })
                  }
                >
                  <option value={""}>Types</option>
                  {types.map((type) => (
                    <option value={type.name}>{type.name}</option>
                  ))}
                </select>
              </th>
              <th style={{ backgroundColor: "white" }}>
                <select
                  onChange={(e) =>
                    setChoices({ ...choices, category: e.target.value })
                  }
                >
                  <option value={""}>Categories</option>
                  {categories.map((cat) => (
                    <option value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </th>
              <th style={{ backgroundColor: "white" }}>
                <select
                  onChange={(e) =>
                    setChoices({ ...choices, size: e.target.value })
                  }
                >
                  <option value={""}>Size</option>
                  {attributes.map((a) => {
                    if (a.type === "size") {
                      return <option value={a.name}>{a.name}</option>;
                    }
                  })}
                </select>
              </th>
              <th style={{ backgroundColor: "white" }}>
                <select
                  onChange={(e) =>
                    setChoices({ ...choices, color: e.target.value })
                  }
                >
                  <option value={""}>Color</option>
                  {attributes.map((a) => {
                    if (a.type === "color") {
                      return <option value={a.name}>{a.name}</option>;
                    }
                  })}
                </select>
              </th>
              <th
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input type="checkbox" id="best-seller" />
                <label htmlFor="best-seller">Best Seller</label>
              </th>
              <th style={{ backgroundColor: "white" }}>
                <button
                  className="btn-add"
                  onClick={() => {
                    setFiltered(filter(inventories));
                  }}
                >
                  Apply filter
                </button>
              </th>
            </tr>
            <tr>
              <th>ID</th>
              <th>image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Sale</th>
              <th>Date</th>
              <th>Actions</th>
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
              {inventories &&
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img
                        src={p.images}
                        alt="product-icon"
                        style={{
                          height: "60px",
                          width: "60px",
                        }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.sale_price ? p.sale_price : p.regular_price}</td>
                    <td>
                      {!edit ? (
                        p.quantity
                      ) : (
                        <input type="number" defaultValue={p.quantity} style={{ width: '80px' }} id="quantity"/>
                      )}
                    </td>
                    <td>{p.total_sale}</td>
                    <td>{p.date}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEdit(true);
                          
                        }}
                        style={{
                          display: edit ? 'none' : "block"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-add"
                        onClick={() => {
                          const payload = {
                            quantity: parseInt(document.getElementById('quantity').value)
                          }
                          console.log(payload);
                          axiosClient.put('/inventories/' + p.id, payload).then(res => {
                            console.log(res.data);
                            window.location.reload()
                          }).catch(err => console.log(err))
                        }}
                        style={{
                          display: edit ? 'block' : 'none'
                        }}
                      >
                        Apply
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
};

export default Inventories;
