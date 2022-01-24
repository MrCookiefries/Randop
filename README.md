# Randop

A shop of random goods

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

##### Post

- `/orders/:cartId` transfers a user's cart over to an order

#### Payments

##### Post

- `/payments` creates a Stripe payment intent for a user

#### Products

##### Get

- `/products` gets the products

- `/products/:id` gets a specific product

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
