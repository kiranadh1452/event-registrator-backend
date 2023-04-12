## Events Registrator Backend

This repo holds the backend code for events registration.

### How to Run ?

> This method of running the app is not recommended. It is recommended to run the app through docker.

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

> Easy as pie. Just make sure that you have docker and docker-compose installed on your machine.

-   Clone this repo.
    ```bash
         git clone git@github.com:kiranadh1452/event-registrator-backend.git
    ```
-   Open the file [src/config/config.example](src/config/config.example) and fill in the required fields.
-   Rename the file to `config.env`.
-   Then run the following command:

    ```bash
        docker build -t ev-reg-back .
        docker-compose up
    ```

    > While running the command, make sure that the active directory is the same as the `docker-compose.yml` file.

### If you're on linux :

> This method is not recommended. I only created this script to make my life easier. This script was originally made to automate the tasks of docker image creation and publishment to docker hub. It is recommended to run the app through docker.

Open the file [src/config/config.example](src/config/config.example) and complete the instructions in the file.

Then run the following commands:

```bash
    sudo chmod +x run-backend.sh
    sudo ./run-backend.sh
```
