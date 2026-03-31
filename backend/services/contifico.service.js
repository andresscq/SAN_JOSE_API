const axios = require("axios");

const fetchCategoriasContifico = async () => {
  const url = "https://api.contifico.com/sistema/api/v1/categoria/";
  const response = await axios.get(url, {
    headers: { Authorization: "L6tQ3yO75iASQ0sjJlCHmzGnHrhpU1sqb0D2gPlv9ts" },
  });
  return response.data;
};

const fetchProductosContifico = async () => {
  const url = "https://api.contifico.com/sistema/api/v1/producto/";
  const response = await axios.get(url, {
    headers: { Authorization: "L6tQ3yO75iASQ0sjJlCHmzGnHrhpU1sqb0D2gPlv9ts" },
  });
  return response.data;
};

module.exports = { fetchCategoriasContifico, fetchProductosContifico };
