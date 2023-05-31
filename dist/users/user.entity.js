"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcrypt_1 = require("bcrypt");
class User {
    constructor(firstName, lastName, email, username, phone, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.phone = phone;
        this.password = password;
        this.isHashPassword = false;
    }
    hashPassword(salt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isHashPassword)
                this.password = yield (0, bcrypt_1.hash)(this.password, salt);
        });
    }
    comparePassword(anotherPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, bcrypt_1.compare)(anotherPassword, this.password);
        });
    }
    getData() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.username,
            phone: this.phone,
            password: this.password
        };
    }
}
exports.User = User;
