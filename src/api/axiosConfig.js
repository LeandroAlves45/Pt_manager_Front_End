import axios from 'axios';

// Obtem variaveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY;

//Criar instancia do axios com configuracao padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tempo limite de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY, // Adiciona a chave de API no header
  }
});

//Interceptor para logs de requisições
api.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
    }
);

//Interceptor para logs de respostas
api.interceptors.response.use(
    (response) => {
       console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`❌ Erro ${error.response.status}:`, error.response.data);

            switch (error.response.status) {
                case 401:
                    console.error('Não autorizado - Verifique a API KEY');
                    break;
                case 403:
                    console.error('Proibido - Você não tem permissão para acessar este recurso');
                    break;
                case 404:
                    console.error('Não encontrado - O recurso solicitado não existe');
                    break;
                case 500:
                    console.error('Erro interno do servidor - Tente novamente mais tarde');
                    break;
                default:
                    console.error('Erro desconhecido:', error.response.data);
            }
        } else if (error.request) {
            // Requisição foi feita mas sem resposta
            console.error('❌ Sem resposta do servidor:', error.request);
        } else {
            // Erro na configuração da requisição
            console.error('❌ Erro na configuração da requisição:', error.message);
        } 

        return Promise.reject(error);
    }
);

export default api;