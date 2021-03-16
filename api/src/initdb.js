const { sequelize } = require('./repositories-sequelize/sequelize');

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
})();
