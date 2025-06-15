import { ApiExpress } from "./api/express/api.express";
import { AuthController } from "./api/express/controllers/auth.controller";
import { UserController } from "./api/express/controllers/user.controller";
import { LogServiceFactory } from "./factories/baseFactories/log.service.factory";
import { AppCacheServiceImplementation } from "./services/baseServices/cache/cache.service.implementation";
import { LogServiceImplementation } from "./services/baseServices/logs/log.service.implementation";

function main() {
    const api = ApiExpress.build();
    const userController = UserController.build();
    const authController = AuthController.build();
    
    //users routes
    api.addPostRoute("/users/register", userController.register);
    api.addGetRoute("/users/listall", userController.listall);
    api.addGetRoute("/users/find-by-email", userController.findOneByEmail);
    api.addGetRoute("/users/change-password", userController.changePassword);

    //auth routes
    api.addPostRoute("/auth/login", authController.login);
    api.addPostRoute("/auth/refresh-token", authController.refreshToken);
    api.start(8000);
}

console.log('Testing LogService.....');
const logService = LogServiceFactory.build();
logService.createLog('TESTE-CREATE-LOG', '67069363087', 'RETORNO', 'Tudo funcionou ok');

console.log('Testing CacheService.....');
const cacheService = AppCacheServiceImplementation.build();
console.log('Setting cache value...');
cacheService.set('TESTE-CACHE-VALUE','VALOR DA CACHE');
console.log('Getting value from Cache: ',cacheService.get('TESTE-CACHE-VALUE'));

main();