const axios = require("axios");
const Dev = require("../models/Dev");
const parseArrayAsString = require("../utils/ParseStringAsArray");
const { findConnections, sendMessage } = require("../Websocket")

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(
                `https://api.github.com/users/${github_username}`
            );

            const techsArray = parseArrayAsString(techs);

            const { name = login, avatar_url, bio } = apiResponse.data;

            const location = {
                type: "Point",
                coordinates: [longitude, latitude]
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            )

            sendMessage(sendSocketMessageTo, 'newDev', dev)
        }

        res.json(dev);
    },

    async update(req, res) {
        let devUpdate = req.body;
        if (devUpdate.techs)
            devUpdate.techs = parseArrayAsString(devUpdate.techs);

        if (devUpdate.latitude && devUpdate.longitude)
            devUpdate.location = {
                type: "Point",
                coordinates: [devUpdate.longitude, devUpdate.latitude]
            };

        if (devUpdate.github_username) delete devUpdate.github_username;

        const dev = await Dev.updateOne({ _id: req.params.id }, devUpdate);

        res.json(dev);
    },

    async destroy(req, res) {
        const dev = await Dev.deleteOne({ _id: req.params.id });

        res.json(dev);
    }
};
