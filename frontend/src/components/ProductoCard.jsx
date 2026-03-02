export const ProductoCard = ({ nombre, precio, local, telefono }) => {
  // 1. Preparamos el mensaje para WhatsApp
  // Usamos "precio" y "local" porque así se los estás pasando desde el Home
  const mensaje = `Hola! Vengo de la web de San José. Me interesa: ${nombre} en el local ${local}.`;

  // 2. Creamos la URL. Si el teléfono no llega, usamos uno por defecto para que no de error
  const numeroDestino = telefono || "593987654321";
  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="bg-white p-6 rounded-[35px] shadow-lg border border-gray-100 flex flex-col items-center hover:shadow-2xl transition-all group duration-300">
      {/* Icono decorativo */}
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
        🥚
      </div>

      {/* Nombre del Producto */}
      <h3 className="text-xl font-black text-green-900 mb-1 text-center uppercase tracking-tight">
        {nombre}
      </h3>

      {/* Precio */}
      <p className="text-green-600 font-black text-2xl mb-1">${precio}</p>

      {/* Botón de WhatsApp */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="w-full bg-green-700 text-white text-center py-4 rounded-2xl font-black hover:bg-yellow-400 hover:text-green-900 transition-all shadow-md active:scale-95 uppercase text-xs tracking-widest"
      >
        Pedir por WhatsApp
      </a>
    </div>
  );
};
