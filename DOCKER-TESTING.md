# Scripts de Teste Local Docker

Scripts para testar o sistema Vitta localmente usando Docker antes de fazer commit/deploy.

## 🚀 Scripts disponíveis

### `test-local.sh` - Rodar tudo
Faz build e executa frontend + backend localmente.

```bash
./test-local.sh
```

Isso vai:
- Fazer build do backend e rodar na porta **3000**
- Fazer build do frontend e rodar na porta **8080**
- Mostrar status dos containers

**URLs após rodar:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### `stop-local.sh` - Parar tudo
Para e remove os containers de teste.

```bash
./stop-local.sh
```

### `logs-local.sh` - Ver logs
Ver logs dos containers.

```bash
# Ver últimas 20 linhas de ambos
./logs-local.sh

# Ver logs do frontend em tempo real
./logs-local.sh frontend

# Ver logs do backend em tempo real
./logs-local.sh backend
```

## 📝 Workflow recomendado

1. Faça suas mudanças no código
2. Execute `./test-local.sh` para testar localmente
3. Abra http://localhost:8080 e teste tudo
4. Se estiver ok, faça commit e push
5. Execute `./stop-local.sh` para limpar

## 🔧 Comandos úteis

```bash
# Ver containers rodando
docker ps

# Ver logs manualmente
docker logs vitta-frontend-test
docker logs vitta-backend-test

# Entrar no container (debug)
docker exec -it vitta-frontend-test sh
docker exec -it vitta-backend-test sh

# Remover imagens antigas
docker rmi vitta-frontend:test vitta-backend:test
```

## ⚙️ Variáveis de ambiente

Para mudar a URL da API no frontend, edite o script `test-local.sh`:

```bash
--build-arg VITE_API_URL=http://localhost:3000
```
