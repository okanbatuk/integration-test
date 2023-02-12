const app = require("./configs/express");
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

module.exports = app;
