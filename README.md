# toDoApi
TODO REST Api to 

# To prepare the Api
Run:
npm install
to install the necessary dependencies
# Add a .env file 
with your passwords and other sensitive data, especially the BD_PSS variable with the password of your mysql server
# Config files
Depending on your environment (development, Qa, Production), modify the .json files in the config folder
# There is only one security description
The apiKey variable of the config file must be identical to the header of each endpoint.
# To endpoints testing
Take a look at the postman folder to test the services
