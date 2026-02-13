import React, {useState} from "react";
import {useClients} from "../hooks/useClients";
import { createClient, archiveClient } from "../api/clientsApi";
import { toast} from "react-toastify";
import { set } from "react-hook-form";

/**
 * Página de listagem e gestão de clientes
 */
const Clients = () => {
    //Estado para filtros
    const [filters, setFilters] = useState({Status: 1}); //1=ativos por padrão
    
    //Hook personalizado para obter clientes
    const {clients, loading, error, refetch} = useClients(filters);

    //Estado para novo cliente
    const [showForm, setShowForm] = useState(false); const [formData, setFormData] = useState({ 
        full_name: '',
        phone: '',
        email: '',
    });

    /**
     * Submete formulário para criar cliente
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await createClient(formData);
            toast.success('Cliente criado com sucesso!');

            //Limpa formulário e fecha
            setFormData({ full_name: '', phone: '', email: '' });
            setShowForm(false);

            //Recarrega lista de clientes
            refetch();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Erro ao criar cliente');
        }
    };

    /**
     * Arquiva cliente
     */
    const handleArchive = async (clientId) => {
        if(window.confirm('Tem certeza que deseja arquivar este cliente?')) {
            return;
        }

        try{
            await archiveClient(clientId);
            toast.success('Cliente arquivado com sucesso!');
            refetch();
        } catch (err) {
            toast.error('Erro ao arquivar cliente');
        }
    };

    //Renderiza lista de clientes
    if (loading) return <div>A carregar clientes...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="clients-page">
            <h1>Clientes</h1>

            {/*Filtros*/}
            <div className="filters">
                <label>
                    Status:
                    <select
                        value={filters.Status || ''}
                        onChange={(e) => setFilters({...filters, Status: Number(e.target.value) })}
                    >
                        <option value="">Todos</option>
                        <option value="1">Ativos</option>
                        <option value="2">Arquivados</option>
                    </select>
                </label>
            </div>

            {/* Botão para adicionar cliente */}
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancelar' : 'Adicionar Cliente'}
            </button>

            {/* Formulário para criar cliente */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome Completo"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value })}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Telefone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value })}
                        required
                    />
                    <button type="submit">Criar Cliente</button>
                </form>
            )}

            {/* Lista de clientes */}
            <div className="clients-list">
                {clients.length === 0 ? (
                    <p>Nenhum cliente encontrado.</p>
                ) : (
                    clients.map(client => (
                        <div key={client.id} className="client-card">
                            <h3>{client.full_name}</h3>
                            <p>Telefone: {client.phone}</p>
                            <p>Email: {client.email}</p>
                            <p>Status: {client.status}</p>

                            {/*Pack ativo (se tiver)*/}
                            {client.active_pack && (
                                <div className="active-pack">
                                    <p>Pack Ativo: {client.active_pack.pack_type_name}</p>
                                    <p>
                                        Sessões: {client.active_pack.sessions_used} / {client.active_pack.sessions_total}
                                        {' '}(Restantes: {client.active_pack.sessions_remaining})
                                    </p>
                                </div>
                            )}

                            {/*Ações*/}
                            <button onClick={() => handleArchive(client.id)}>
                                Arquivar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Clients;
