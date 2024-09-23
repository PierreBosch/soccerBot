module.exports = {
  apps: [
    {
      name: "futebot-start",
      script: "npm",
      args: "run start",
      watch: false,
      autorestart: true,     
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
