import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";
// import img from '../assets/logo-pis.png'

const ProductCategories = () => {
    const [categories, setcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext()

    useEffect(() => {
        getcategories();
    }, [])

    const onDeleteClick = product => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return
        }
        axiosClient.delete(`/product-categories/${product.id}`)
            .then(() => {
                setNotification('Product was successfully deleted')
                getcategories()
            })
    }

    const getcategories = () => {
        setLoading(true)
        axiosClient.get('/product-categories')
            .then(({ data }) => {
                console.log(data);
                setLoading(false)
                setcategories(data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <h1>categories</h1>
                <Link className="btn-add" to="/categories/new">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Parent ID</th>
                            <th>image</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" class="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {categories && categories.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.category_id}</td>
                                    <td>
                                        <img 
                                            src={p.images} 
                                            alt="product-icon" 
                                            style={{
                                                height: '60px',
                                                width: '60px',
                                            }}
                                        />
                                    </td>
                                    <td>{p.name}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/categories/' + p.id}>Edit</Link>
                                        &nbsp;
                                        <button className="btn-delete" onClick={ev => onDeleteClick(p)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}

export default ProductCategories
