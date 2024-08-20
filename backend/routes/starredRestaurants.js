const express = require("express");
const { v4: uuidv4, v4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
    {
        id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
        restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
        comment: "Best pho in NYC",
    },
    {
        id: "8df59b21-2152-4f9b-9200-95c19aa88226",
        restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
        comment: "Their lunch special is the best!",
    },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
    /**
     * We need to join our starred data with the all restaurants data to get the names.
     * Normally this join would happen in the database.
     */
    const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
        (starredRestaurant) => {
            const restaurant = ALL_RESTAURANTS.find(
                (restaurant) => restaurant.id === starredRestaurant.restaurantId
            );

            return {
                id: starredRestaurant.id,
                comment: starredRestaurant.comment,
                name: restaurant.name,
            };
        }
    );

    res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
    const starredId = req.params.id;
    const starredRestaurant = STARRED_RESTAURANTS.find(
        (starredRestaurant) => starredRestaurant.id === starredId
    );
    if (starredRestaurant === undefined) {
        res.status(400).send("Provided ID not valid.");
    }
    const restaurant = ALL_RESTAURANTS.find(
        (aRestaurant) => aRestaurant.id === starredRestaurant.restaurantId
    );

    const returnedRestaurant = {
        id: restaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
    };

    //TODO: both paths return the incorrect restaurant name for the provided restaurant id -- /, /{id}
    res.json(returnedRestaurant);
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
    const { id, comment } = req.body;
    const restaurant = ALL_RESTAURANTS.find(
        (aRestaurant) => aRestaurant.id === id
    );
    if (restaurant === undefined) {
        res.status(400).send(
            "The provided ID doesn't relate to a current restaurant."
        );
    }
    const newId = v4();
    const newRestaurant = {
        id: newId,
        restaurantId: restaurant.id,
        comment,
    };
    STARRED_RESTAURANTS.push(newRestaurant);
    res.json(newRestaurant);
});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    if (STARRED_RESTAURANTS.find((r) => r.id === id) === undefined) {
        res.status(400).send("Restaurant with that ID not found");
    }
    STARRED_RESTAURANTS = STARRED_RESTAURANTS.filter(
        (restaurant) => restaurant.id !== id
    );
    res.status(200).send("Restaurant deleted");
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { newComment } = req.body;
    const restaurant = STARRED_RESTAURANTS.find(
        (restaurant) => restaurant.id === id
    );
    if (restaurant) {
        if (newComment) {
            restaurant.comment = newComment;
        } else {
            res.status(400).send("No comment provided");
        }
    } else {
        res.status(400).send("Restaurant with that ID doesn't exist.");
    }
    res.status(200).send("Restaurant comment updated");
});

module.exports = router;
