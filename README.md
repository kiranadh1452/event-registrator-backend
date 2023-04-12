## Events Registrator Backend

This repo holds the backend code for events registration.

### How to Run ?

1. Clone this repo.
    ```bash
         git clone git@github.com:kiranadh1452/event-registrator-backend.git
    ```
2. Install the dependencies.
    ```bash
        npm install
    ```
3. Open the file [src/config/config.example](src/config/config.example) and fill in the required fields.
4. Rename the file to `config.env`.
5. Run the following command:
    ```bash
        npm start
    ```

### How to Run through Docker ?

-   Easy as pie. Just make sure that you have docker and docker-compose installed on your machine.
-   Either clone this repo or download only the `docker-compose.yml` file.
-   Then run the following command:
    ```bash
        docker-compose up
    ```

    > While running the command, make sure that the activ directory is the same as the `docker-compose.yml` file.
