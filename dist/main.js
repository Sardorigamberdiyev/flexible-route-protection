"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_service_1 = require("./config/config.service");
const countries_controller_1 = require("./countries/countries.controller");
const countries_repository_1 = require("./countries/countries.repository");
const countries_service_1 = require("./countries/countries.service");
const database_service_1 = require("./database/database.service");
const log_1 = require("./log/log");
const users_controller_1 = require("./users/users.controller");
const users_repository_1 = require("./users/users.repository");
const users_service_1 = require("./users/users.service");
function bootstrap() {
    const configService = new config_service_1.ConfigService();
    const log = new log_1.Log();
    const databaseService = new database_service_1.DatabaseService(configService);
    const usersRepository = new users_repository_1.UsersRepository(databaseService);
    const usersService = new users_service_1.UsersService(configService, usersRepository);
    const usersController = new users_controller_1.UsersController(log, usersService, usersRepository);
    const countriesRepository = new countries_repository_1.CountriesRepository(databaseService);
    const countriesService = new countries_service_1.CountriesService(countriesRepository);
    const countriesController = new countries_controller_1.CountriesController(log, countriesService);
    const app = new app_1.App(configService, log, [usersController, countriesController]);
    app.init();
}
bootstrap();
