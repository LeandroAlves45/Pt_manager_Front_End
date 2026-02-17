import axios from 'axios';

// Obtem variaveis de ambiente
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://ptmanagerbackend-production.up.railway.app' // Produção
    : 'http://localhost:8000'); // Desenvolvimento local
const API_KEY = import.meta.env.VITE_API_KEY;

//Criar instancia do axios com configuracao padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tempo limite de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-KEY': API_KEY }), // Adiciona a chave de API no header
  },
});

//Interceptor para logs de requisições
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

//Interceptor para logs de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 422) {
        // 422: Validação do Pydantic falhou
        // O campo "detail" é um array com todos os erros de validação
        console.error(`❌ Erro 422 - Validação falhou:`);

        if (data.detail && Array.isArray(data.detail)) {
          // Itera cada erro de validação e mostra separadamente
          data.detail.forEach((err) => {
            // loc: localização do erro (ex: ["body", "name"])
            // msg: mensagem do erro
            // type: tipo do erro Pydantic
            console.error(
              `  Campo: ${err.loc.join(' → ')} | Erro: ${err.msg} | Tipo: ${err.type}`
            );
          });
        } else {
          // Fallback para outros formatos de erro 422
          console.error(JSON.stringify(data, null, 2));
        }
      } else if (status === 405) {
        console.error(`❌ Erro 405:`, data);
      } else if (status === 404) {
        console.error(`❌ Erro 404:`, data);
      } else {
        console.error(`❌ Erro ${status}:`, data);
      }
    } else {
      console.error('Erro desconhecido:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
