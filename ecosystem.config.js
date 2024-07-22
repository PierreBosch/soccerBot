module.exports = {
  apps: [
    {
      name: "futebot-start",
      script: "npm",
      args: "run start",
      watch: false
    },
    {
      name: "futebot-db",
      script: "npm",
      args: "run db",
      watch: false
    }
  ]
};
