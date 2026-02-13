import {useState, useEffect} from 'react';
import {getClients} from '../api/clientsApi';

/**
 * Hook para gerenciar clientes
 * @param {Object} filters - Filtros para busca de clientes
 * @return {Object} Estado e funções para manipular clientes
 */

export const useClients = (filters = {}) => {
    const [clients, setClients] = useState([]); //lista de clientes
    const [loading, setLoading] = useState(true); // estado de carregamento
    const [error, setError] = useState(null); // estado de erro

    /**
    * Função para carregar clientes da API
    */
    const fetchClients = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getClients(filters);
            setClients(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Erro ao carregar clientes');
            console.error('Erro ao carregar clientes:', err);
        }
    };

    // Carrega clientes quando o componente é montado ou quando os filtros mudam
    useEffect(() => {
        fetchClients();
    }, [JSON.stringify(filters)]); // Converte para String para comparação

    /**
     * Função para recarregar clientes manualmente
     */
    const refetch = () => {
        fetchClients();
    };

    return { 
        clients, //Lista de clientes 
        loading, //true enquanto carrega
        error, //mensagem de erro
        refetch }; //função para recarregar clientes
};
