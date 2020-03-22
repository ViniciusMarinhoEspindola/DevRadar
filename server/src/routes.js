const { Router } = require("express");
const DevController = require("./controllers/DevController");
const SearchController = require("./controllers/SearchController");

const route = Router();

route.get("/devs", DevController.index);
route.post("/devs", DevController.store);
route.put("/devs/:id", DevController.update);
route.delete("/devs/:id", DevController.destroy);

route.get("/search", SearchController.index);

module.exports = route;
