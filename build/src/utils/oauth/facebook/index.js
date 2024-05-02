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
// server.js (ou index.js)
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const app = express();
const FACEBOOK_CLIENT_ID = 'seu_client_id';
const FACEBOOK_CLIENT_SECRET = 'seu_client_secret';
const REDIRECT_URI = 'http://localhost:3000/auth/facebook/callback';
app.get('/auth/facebook', (req, res) => {
    const facebookAuthUrl = `https://www.facebook.com/v9.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(facebookAuthUrl);
});
app.get('/auth/facebook/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const tokenUrl = `https://graph.facebook.com/v9.0/oauth/access_token?${querystring.stringify({
        client_id: FACEBOOK_CLIENT_ID,
        client_secret: FACEBOOK_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
    })}`;
    try {
        const response = yield axios.get(tokenUrl);
        const access_token = response.data.access_token;
        // Com o access_token, agora você pode buscar informações do perfil do usuário
        // ...
        res.send('Login com Facebook bem-sucedido!');
    }
    catch (error) {
        res.send('Erro ao autenticar com o Facebook.');
    }
}));
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
