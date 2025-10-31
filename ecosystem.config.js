/**
 * ⚠️  DEPRECADO - Este arquivo está mantido apenas para compatibilidade com desenvolvimento local
 * 
 * Para produção, use Docker Compose ao invés de PM2:
 * - docker-compose up -d
 * - Consulte DOCKER_COMPOSE_GUIDE.md para mais informações
 * 
 * PM2 foi removido do Dockerfile e não é mais usado em containers.
 */

require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "futebot-start",
      script: "npm",
      args: "run start",
      watch: false,
      autorestart: true,
      env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        EVOLUTION_API_URL: process.env.EVOLUTION_API_URL,
        EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY,
        EVOLUTION_INSTANCE_NAME: process.env.EVOLUTION_INSTANCE_NAME,
        WEBHOOK_URL: process.env.WEBHOOK_URL,
        PORT: process.env.PORT || 3000
      }
    },
    {
      name: "futebot-db",
      script: "npm",
      args: "run db",
      watch: false,
      autorestart: true,     
    }
  ]
};
