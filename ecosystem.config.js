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
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
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
