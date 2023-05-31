import { App } from './app';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ConfigService } from './config/config.service';
import { CountriesController } from './countries/countries.controller';
import { CountriesRepository } from './countries/countries.repository';
import { CountriesService } from './countries/countries.service';
import { DatabaseService } from './database/database.service';
import { Log } from './log/log';
import { PermissionsRepository } from './permissions/permissions.repository';
import { RolesRepository } from './roles/roles.repository';
import { UsersController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';

function bootstrap() {
    const log = new Log();
    const configService = ConfigService.getInstance();
    const databaseService = DatabaseService.getInstance(configService);
    const usersRepository = new UsersRepository(databaseService);
    const usersService = new UsersService(usersRepository);
    const rolesRepository = new RolesRepository(databaseService);
    const permissionsRepository = new PermissionsRepository(databaseService);
    const authService = new AuthService(configService, usersRepository, rolesRepository, permissionsRepository);
    const authController = new AuthController(log, usersService, authService);
    const usersController = new UsersController(log, usersService);
    const countriesRepository = new CountriesRepository(databaseService);
    const countriesService = new CountriesService(countriesRepository)
    const countriesController = new CountriesController(log, countriesService);
    const app = new App(configService, log, [authController, usersController, countriesController]);
    app.init();
}

bootstrap();