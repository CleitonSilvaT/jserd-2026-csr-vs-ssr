#!/bin/bash

# Script para iniciar backend e frontend simultaneamente

echo "Iniciando servidores..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5500"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "Encerrando servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

# Iniciar backend
cd "${SCRIPT_DIR}/../apps/backend"
npm start &
BACKEND_PID=$!
cd "${SCRIPT_DIR}/.."

# Aguardar um pouco para o backend iniciar
sleep 2

# Iniciar frontend
cd "${SCRIPT_DIR}/../apps/frontend"
npm run dev &
FRONTEND_PID=$!
cd "${SCRIPT_DIR}/.."

echo "Servidores iniciados!"
echo "Pressione Ctrl+C para encerrar"
echo ""

# Aguardar processos
wait
