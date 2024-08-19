//npm install express sqlite3 sqlite
//node BD4_Assignment1/initDB.js
//node BD4_Assignment1
const { Console } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./BD4_Assignment1/database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4 _Assignment1 => FoodieFinds" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Get All Restaurants

Objective: Fetch all restaurants from the database.

Query Parameters: None

Tasks: Implement a function to fetch all restaurants.

Example Call:

http://localhost:3000/restaurants
*/
//function  to fetch all restaurants
async function fetchAllRestaurants() {
  let query = "SELECT * FROM restaurants";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      Console.log("Error : No Restaurants Found");
      throw new Error("No Restaurants Found");
    }
    return { restaurants: result };
  } catch (error) {
    Console.log("Error in fetching Restaurants : ", error.message);
    throw error;
  }
}
// api to fetch all restaurants
app.get("/restaurants", async (req, res) => {
  try {
    let restaurants = await fetchAllRestaurants();
    console.log(
      "successfully fetched all " +
        restaurants.restaurants.length +
        "  restaurants",
    );
    return res.status(200).json(restaurants);
  } catch (error) {
    if (error.message === "No Restaurants Found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 2: Get Restaurant by ID

Objective: Fetch a specific restaurant by its ID.

Query Parameters:

id (integer)

Tasks: Implement a function to fetch a restaurant by its ID.

Example Call:

http://localhost:3000/restaurants/details/1
*/
//function to fetch a restaurant by its ID
async function fetchRestaurantById(id) {
  let query = "SELECT * FROM restaurants WHERE id = ?";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.get(query, [id]);
    if (!result) {
      Console.log("Error : No Restaurant Found");
      throw new Error("No Restaurant Found");
    }
    return { restaurant: result };
  } catch (error) {
    Console.log("Error in fetching Restaurant : ", error.message);
    throw error;
  }
}
//api to fetch a restaurant by its ID
app.get("/restaurants/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let restaurant = await fetchRestaurantById(id);
    console.log("successfully fetched restaurant with id : " + id);
    return res.status(200).json(restaurant);
  } catch (error) {
    if (error.message === "No Restaurant Found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 3: Get Restaurants by Cuisine

Objective: Fetch restaurants based on their cuisine.

Query Parameters:

cuisine (string)

Tasks: Implement a function to fetch restaurants by cuisine.

Example Call:

http://localhost:3000/restaurants/cuisine/Indian
*/
//function to fetch restaurants by cuisine
async function fetchRestaurantsByCuisine(cuisine) {
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.all(query, [cuisine]);
    if (!result || result.length == 0) {
      Console.log("Error : No Restaurants Found for cuisine : " + cuisine);
      throw new Error("No Restaurants Found for cuisine : " + cuisine);
    }
    return { restaurants: result };
  } catch (error) {
    Console.log(
      "Error in fetching Restaurants for  cuisine : " + cuisine,
      error.message,
    );
    throw error;
  }
}
//api to fetch restaurants by cuisine
app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let restaurants = await fetchRestaurantsByCuisine(cuisine);
    console.log(
      "successfully fetched " +
        restaurants.restaurants.length +
        "  restaurants for cuisine : " +
        cuisine,
    );
    return res.status(200).json(restaurants);
  } catch (error) {
    if (error.message === "No Restaurants Found for cuisine : " + cuisine) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 4: Get Restaurants by Filter

Objective: Fetch restaurants based on filters such as veg/non-veg, outdoor seating, luxury, etc.

Query Parameters:

isVeg (string)

hasOutdoorSeating (string)

isLuxury (string)

Tasks: Implement a function to fetch restaurants by these filters.

Example Call:

http://localhost:3000/restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false
*/
//function to fetch restaurants by filters
async function fetchRestaurantsByFilters(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

    if (!result || result.length == 0) {
      Console.log(
        "Error : No Restaurants Found for filters : isVeg = " +
          isVeg +
          "  hasOutdoorSeating = " +
          hasOutdoorSeating +
          " isLuxury = " +
          isLuxury,
      );
      throw new Error(
        "No Restaurants Found for filters : isVeg = " +
          isVeg +
          " hasOutdoorSeating = " +
          hasOutdoorSeating +
          " isLuxury = " +
          isLuxury,
      );
    }

    return { restaurants: result };
  } catch (error) {
    Console.log(
      "Error in fetching Restaurants for  filters : isVeg = " +
        isVeg +
        "  hasOutdoorSeating = " +
        hasOutdoorSeating +
        "  isLuxury = " +
        isLuxury,
      error.message,
    );
    throw error;
  }
}
//api to fetch restaurants by filters
app.get("/restaurants/filter", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let restaurants = await fetchRestaurantsByFilters(
      isVeg,
      hasOutdoorSeating,
      isLuxury,
    );
    console.log(
      "successfully fetched " +
        restaurants.restaurants.length +
        "  restaurantsfor  filters : isVeg = " +
        isVeg +
        "  hasOutdoorSeating = " +
        hasOutdoorSeating +
        "  isLuxury = " +
        isLuxury,
    );
    return res.status(200).json(restaurants);
  } catch (error) {
    if (
      "No Restaurants Found for filters : isVeg = " +
      isVeg +
      " hasOutdoorSeating = " +
      hasOutdoorSeating +
      " isLuxury = " +
      isLuxury
    ) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 5: Get Restaurants Sorted by Rating

Objective: Fetch restaurants sorted by their rating ( highest to lowest ).

Query Parameters: None

Tasks: Implement a function to fetch restaurants sorted by rating.

Example Call:

http://localhost:3000/restaurants/sort-by-rating
*/
//function to fetch restaurants sorted by rating
async function fetchRestaurantsByRating() {
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      Console.log("Error : No Restaurants Found");
      throw new Error("No Restaurants Found");
    }
    return { restaurants: result };
  } catch (error) {
    Console.log("Error in fetching Restaurants : ", error.message);
    throw error;
  }
}
//api to fetch restaurants sorted by rating
app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let restaurants = await fetchRestaurantsByRating();
    console.log("successfully fetched all restaurants sorted by rating");
    return res.status(200).json(restaurants);
  } catch (error) {
    if (error.message === "No Restaurants Found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 6: Get All Dishes

Objective: Fetch all dishes from the database.

Query Parameters: None

Tasks: Implement a function to fetch all dishes.

Example Call:

http://localhost:3000/dishes
*/
//function to fetch all dishes
async function fetchAllDishes() {
  let query = "SELECT * FROM dishes";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      Console.log("Error : No Dishes Found");
      throw new Error("No Dishes Found");
    }
    return { dishes: result };
  } catch (error) {
    Console.log("Error in fetching Dishes : ", error.message);
    throw error;
  }
}
//api to fetch all dishes
app.get("/dishes", async (req, res) => {
  try {
    let dishes = await fetchAllDishes();
    console.log("successfully fetched all " + dishes.dishes.length + " dishes");
    return res.status(200).json(dishes);
  } catch (error) {
    if (error.message === "No Dishes Found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 7: Get Dish by ID

Objective: Fetch a specific dish by its ID.

Query Parameters:

id (integer)

Tasks: Implement a function to fetch a dish by its ID.

Example Call:

http://localhost:3000/dishes/details/1
*/
//function to fetch a dish by its ID
async function fetchDishById(id) {
  let query = "SELECT * FROM dishes WHERE id = ?";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.get(query, [id]);
    if (!result) {
      Console.log("Error : No Dish Found with id : " + id);
      throw new Error("No Dish Found with id : " + id);
    }
    return { dish: result };
  } catch (error) {
    Console.log("Error in fetching Dish : ", error.message);
    throw error;
  }
}
//api to fetch a dish by its ID
app.get("/dishes/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let dish = await fetchDishById(id);
    console.log("successfully fetched dish with id : " + id);
    return res.status(200).json(dish);
  } catch (error) {
    if (error.message === "No Dish Found with id : " + id) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 8: Get Dishes by Filter

Objective: Fetch dishes based on filters such as veg/non-veg.

Query Parameters:

isVeg (boolean)

Tasks: Implement a function to fetch dishes by these filters.

Example Call:

http://localhost:3000/dishes/filter?isVeg=true
*/
//function to fetch dishes by filters
async function fetchDishesByFilters(isVeg) {
  let query = "SELECT * FROM dishes WHERE isVeg = ?";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.all(query, [isVeg]);
    if (!result || result.length == 0) {
      console.log("Error : No Dishes Found for filters : isVeg = " + isVeg);
      throw new Error("No Dishes Found for filters : isVeg = " + isVeg);
    }
    return { dishes: result };
  } catch (error) {
    console.log(
      "Error in fetching Dishes for  filters : isVeg = " + isVeg,
      error.message,
    );
    throw error;
  }
}
//api to fetch dishes by filters
app.get("/dishes/filter", async (req, res) => {
  let isVeg = req.query.isVeg;
  //== "true"; // Convert the query parameter to a boolean
  try {
    let dishes = await fetchDishesByFilters(isVeg);
    console.log(
      "successfully fetched " +
        dishes.dishes.length +
        "  dishes for  filters : isVeg = " +
        isVeg,
    );
    return res.status(200).json(dishes);
  } catch (error) {
    if (error.message === "No Dishes Found for filters : isVeg = " + isVeg) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 9: Get Dishes Sorted by Price

Objective: Fetch dishes sorted by their price ( lowest to highest ).

Query Parameters: None

Tasks: Implement a function to fetch dishes sorted by price.

Example Call:

http://localhost:3000/dishes/sort-by-price
*/
//function to fetch dishes sorted by price
async function fetchDishesByPrice() {
  let query = "SELECT * FROM dishes ORDER BY price ASC";
  try {
    if (!db) {
      throw new Error("DataBase not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      Console.log("Error : No Dishes Found");
      throw new Error("No Dishes Found");
    }
    return { dishes: result };
  } catch (error) {
    Console.log("Error in fetching Dishes : ", error.message);
    throw error;
  }
}
//api to fetch dishes sorted by price
app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let dishes = await fetchDishesByPrice();
    console.log("successfully fetched all dishes sorted by price");
    return res.status(200).json(dishes);
  } catch (error) {
    if (error.message === "No Dishes Found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
