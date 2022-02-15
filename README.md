# Randop

Deployed [here on Heroku][heroku]

An online shop of random goods!

---

## Setup

### Requirements

- Clone of this GitHub repository

  - [Guide][clonedocs] on their docs of how to

- Node.js installed with NPM

  - [Guide][nodedocs] on how to install them

- PostgreSQL installed

  - [Downloads page][psqldocs] of installers

### Post installment

1. Change into the root directory of the cloned repository

   ```bash
   cd ./Randop # or whatever you named it
   ```

1. Run the npm command to install the dependencies from `package.json`

   ```bash
   npm i
   ```

### Configuration

#### Environment variables

##### Setting them

1.  Create an `.env` file in the root directory

    ```bash
    touch .env
    ```

1.  Add them into the newly made file using the format

    ```
    VARIABLE_NAME=variable-value
    ```

    One variable per line

##### Required variables

- `STRIPE_TOKEN` to use the Stripe API from [Stripe][stripe]

  This can be obtained from creating an account with them, and viewing your developer keys in test mode, the secret one, not the publishable key

##### Optional variables

- `SECRET_KEY` (**strongly encouraged**) to sign JSONWebTokens

  Should be at least 32 characters long, able to use `A-Z`, `a-z`, & `0-9` (alphanumeric)

- `PORT` for the Express server to run on

  Any available HTTP port number

- `DATABASE_URL` for the server to connect to the PSQL database

  Should be the `connectionString` value for the Node `pg` package to create a `Client` with

### Running the code

All these actions should be performed from the root directory of the project. The database also needs to be up and running

#### Production mode

- Run the command

  ```bash
  npm run start
  ```

#### Development mode

- Run the command

  ```bash
  npm run dev
  ```

#### Testing mode

- Run the command

  ```bash
  npm run test
  ```

## Usage

### Abilities

- Create & log into user accounts

- User authorization for protected routes

- Full CRUD on products

- Create, view & delete carts

- Add, remove, or edit items in a cart

- Create orders from checked out carts

- Create stripe customers & create payment intents

### Endpoints

#### Auth

##### Post

- `/auth` login to get user info & JWT

#### Cart Items

##### Get

- `/cartItems/:cartId` gets the items in a cart

##### Post

- `/cartItems` creates a new item in a cart

##### Patch

- `/cartItems` updates an item in a cart

##### Delete

- `/cartItems/:cartId/:productId` deletes an item from a cart

#### Carts

##### Get

- `/carts` gets the carts for a user

##### Post

- `/carts` creates a new cart for a user

##### Delete

- `/carts/:cartId` deletes a cart

#### Customers

##### Post

- `/customers` creates a new Stripe customer

#### Orders

##### Get

- `/orders` gets the orders

- `/orders/count` gets the total count of orders

##### Post

- `/orders/:cartId` transfers a user's cart over to an order

#### Payments

##### Post

- `/payments` creates a Stripe payment intent for a user

#### Products

##### Get

- `/products` gets the products

- `/products/:id` gets a specific product

- `/products/count` gets the total count of products

##### Post

- `/products` creates a new product

##### Patch

- `/products/:id` updates a product

##### Delete

- `/products/:id` deletes a product

#### Users

##### Get

- `/users/:userId` gets a specific user

##### Post

- `/users` creates a new user

##### Patch

- `/users/:userId` updates a user

### Expected data

Many routes require a body of JSON data to be sent in. What's required and expected of them are defined through JSONSChemas, which can be found in the `./jsonschemas` folder for each route that has one. Tests for the routes also show expected inputs & outputs.

## About

### Technology & Tools used

- Node.js (runtime environment for JS)

- Express (JS server framework)

- PG (database driver for PGSQL)

- PostgreSQL (database)

- BCrypt (encryption)

- JSON Schema (validate data)

- JSON Web Token (authentification)

- Stripe (API for payments)

- Jest & Supertest (testing)

### Creation

I started off with a CSV file of product information. It was cluttered with many additional columns of information. The first thing I done was clean it up & format it into a more usable manner. It turned into a seed file for the DB to have some starter data to work with.

After that, I had to setup the express server, so that I could then starting making DB resource models that would query the database. Those models were used in the routes, so that none of the routes would be clutered with DB queries.

Many of the routes had duplicated logic, so I tried to remove most of it by taking out that logic and making it into it's own functiont to re-use. As well as applying some middlewaret to run for every request.

After building out the routes, I begin to work on the authentification & authorization, so that they would be locked down to only certain users that can perform certain actions. With JWT's, it went very smoothly.

As for the testing, there was going to be a lot of files, so as I made them, I also kept the tests up to do date, that way I'd not find myself trying to write all of them at once.

Throughout all of it, I found myself refactoring code over and over again. Consistently finding new and better ways to go about doing a certain action.

While the resource models don't validate any incomming data, the routes are kept clean by validating before passing it to the models. I felt as though, the models should stick to doing one thing, and validating data was not it. That felt more fitting to be implemented on the specific routes. This was accomplished by using JSON Schema, since all the incomming data is expected to be in JSON format.

## Miscellaneous

### The Project

Idea & proposal [document][propdoc]

### Frontend

GitHub [repository][frontend]

[propdoc]: https://docs.google.com/document/d/1GeBA5F2FUrwJjChO0FZVRbl-ahbvo_mttXK2lCwzmUk/edit?usp=sharing
[frontend]: https://github.com/MrCookiefries/RandopFrontend
[clonedocs]: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
[nodedocs]: https://nodejs.dev/learn/how-to-install-nodejs
[psqldocs]: https://www.postgresql.org/download/
[stripe]: https://stripe.com/
[heroku]: https://randop.herokuapp.com/
