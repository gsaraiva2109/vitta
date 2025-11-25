# Guia Rápido: Configurando o Ambiente no Windows com WSL

Este guia ensina como configurar seu ambiente Windows para rodar o projeto Vitta.

## Passo 1: Instalar o WSL (Ambiente Linux no Windows)

1.  Abra o **PowerShell** ou **Prompt de Comando** como **Administrador**.
2.  Digite o comando abaixo e pressione Enter:
    ```sh
    wsl --install
    ```
3.  Reinicie o computador quando solicitado. Após reiniciar, o Ubuntu será instalado. Crie seu usuário e senha quando solicitado.

## Passo 2: Instalar Docker e Git

1.  **Docker**: Baixe e instale o [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/). Durante a instalação, garanta que a opção **"Use WSL 2 based engine"** esteja marcada.
2.  **Git**: Se não tiver o Git, instale-o no Ubuntu com o comando:
    ```sh
    sudo apt update && sudo apt install git -y
    ```

## Passo 3: Acessar o Projeto

1.  Abra o terminal **Ubuntu** (pelo Menu Iniciar).
2.  Se você ainda não baixou o projeto, clone o repositório. Se já baixou, navegue até a pasta.
    ```sh
    # Para clonar (se ainda não fez)
    git clone URL_DO_SEU_REPOSITORIO_AQUI
    
    # Para acessar a pasta
    cd vitta
    ```

## Passo 4: Usando os Scripts

Execute os seguintes comandos de dentro da pasta `vitta` no terminal do Ubuntu.

#### Para Desenvolver e Testar

*   **Subir a aplicação localmente:**
    *   **Comando:** `./deploy-local.sh`
    *   **O que faz:** Inicia o banco de dados, a API e o frontend. Na primeira vez, pode demorar um pouco para baixar e construir tudo.

*   **Parar a aplicação:**
    *   **Comando:** `./stop-local.sh`
    *   **O que faz:** Para a aplicação, mas **mantém os dados do banco de dados salvos** para o próximo uso.

*   **Ver os logs (erros e informações):**
    *   **Comando:** `./logs-local.sh`
    *   **O que faz:** Mostra os logs da API e do frontend em tempo real. Útil para depurar.

#### Antes de Enviar o Código (Push)

*   **Rodar a verificação completa (CI/CD):**
    *   **Comando:** `./final-deploy-test.sh`
    *   **O que faz:** Simula o processo de integração contínua. Ele roda os linters (análise de código), os testes do backend e verifica se a aplicação constrói sem erros. **Execute sempre antes de dar `git push`**.
