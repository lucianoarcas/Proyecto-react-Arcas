import { useState, useContext } from "react"
import { CarritoContext } from "../../Context/CarritoContext"
import { db } from "../../services/config"
import { collection, addDoc } from "firebase/firestore"
import "../Checkout/Checkout.css"

const Checkout = () => {
    const { cart, clearCart } = useContext(CarritoContext);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [emailConfimarcion, setEmailConfirmacion] = useState("");
    const [error, setError] = useState("");
    const [ordenId, setOrdenId] = useState("");


    const manejadorSubmit = (event) => {
        event.preventDefault();

        if (!nombre || !apellido || !telefono || !email || !emailConfimarcion) {
            setError("Por favor complete todos los campos");
            return;
        }

        if (email !== emailConfimarcion) {
            setError("El email de confirmación no coincide");
            return;
        }


        const orden = {
            items: cart.map(producto => ({
                id: producto.item.id,
                nombre: producto.item.nombre,
                cantidad: producto.cantidad,
            })),
            total: cart.reduce((total, producto) => total + producto.item.precio * producto.cantidad, 0),
            nombre,
            apellido,
            telefono,
            email
        };

        addDoc(collection(db, "ordenes"), orden)
            .then((docRef) => {
                setOrdenId(docRef.id);
                clearCart();
            })
            .catch((error) => {
                console.log("Error al crear la orden", error);
                setError("Se produjo un error al crear la orden, intente más tarde");
            })

        
    }

    return (
        <div>
            <h2>Checkout</h2>
            <form onSubmit={manejadorSubmit}>

                {cart.map(producto => (
                    <div key={producto.item.id}>
                        <p> {producto.item.nombre} x {producto.cantidad} </p>
                        <p>Precio: $ {producto.item.precio} </p>
                        <hr />
                    </div>
                ))}
                <hr />
                <div className="datosComprador">
                    
                    <div>
                        <label htmlFor=""> Nombre </label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor=""> Apellido </label>
                        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor=""> Telefono</label>
                        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor=""> Email </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor=""> Email Confirmación </label>
                        <input type="email" value={emailConfimarcion} onChange={(e) => setEmailConfirmacion(e.target.value)} />
                    </div>
                

                {
                    error && <p style={{ color: "red" }}> {error} </p>
                }

                <button type="submit"> Finalizar Orden </button>

                {
                    ordenId && (
                        <strong>¡Gracias por tu compra! Tu número de orden es: {ordenId} </strong>
                    )
                }
                </div>
            </form>
        </div>
    )

}
export default Checkout