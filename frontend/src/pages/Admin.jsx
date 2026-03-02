import { useEffect, useState } from "react";
import api from "../api/axios";

export const Admin = () => {
  const [productos, setProductos] = useState([]);

  // 1. Cargar productos apenas entres a la página
  const cargarProductos = async () => {
    try {
      const res = await api.get("/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos", err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // 2. Función para mandar el nuevo precio al Backend
  const handleUpdate = async (id, nuevoPrecio) => {
    try {
      await api.put(`/api/productos/${id}`, { precio_unidad: nuevoPrecio });
      alert("¡Precio actualizado en San José!");
      cargarProductos(); // Refrescar la lista
    } catch (err) {
      alert("Hubo un error al guardar");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        Panel Administrativo
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Sede</th>
              <th className="p-4">Precio ($)</th>
              <th className="p-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4 font-semibold">{p.nombre}</td>
                <td className="p-4 text-gray-500 text-sm">{p.nombre_sede}</td>
                <td className="p-4">
                  <input
                    type="number"
                    step="0.01"
                    className="border rounded px-2 py-1 w-24"
                    defaultValue={p.precio_unidad}
                    id={`input-${p.id}`}
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      handleUpdate(
                        p.id,
                        document.getElementById(`input-${p.id}`).value,
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
