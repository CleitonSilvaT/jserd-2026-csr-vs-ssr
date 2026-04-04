#!/bin/bash

# Script para iniciar backend e frontend simultaneamente

echo "Iniciando servidores..."
echo "Backend: http://localhost:3000"
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

# Iniciar backend
cd back-end
npm start &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend iniciar
sleep 2

# Iniciar frontend
cd front-end
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Servidores iniciados!"
echo "Pressione Ctrl+C para encerrar"
echo ""

# Aguardar processos
wait
