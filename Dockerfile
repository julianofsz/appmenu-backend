FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta do backend
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["npm", "start"]
