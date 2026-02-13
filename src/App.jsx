import { useEffect, useState } from 'react'
import { testConnection } from './api/testApi'
import './App.css'

function App() {
  const [status, setStatus] = useState('Testando conexão...');

  useEffect(() => {
    // Testa conexão com a API ao montar o componente
    testConnection().then((sucess) => {
      if (sucess) {
        setStatus('✅ Conexão com API estabelecida! Vê a consola para detalhes.');
      } else {
        setStatus('❌ Falha ao conectar com a API. Verifica a consola para erros.');
      }
    });
  }, []);

  return (
    <div className="App">
      <h1>PT Manager Frontend</h1>
      <p>{status}</p>
      <p>Abre a Consola do Browser (F12) para ver os logs das requisições</p>
    </div>
  );
}

export default App
