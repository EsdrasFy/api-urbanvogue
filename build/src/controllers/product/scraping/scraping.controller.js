"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scraping = void 0;
require("dotenv").config();
const { Translate } = require("@google-cloud/translate").v2;
const puppeteer = __importStar(require("puppeteer"));
const natural = __importStar(require("natural"));
const product_model_1 = __importDefault(require("../../../database/models/product/product.model"));
const product_image_model_1 = require("../../../database/models/product/product-image/product-image.model");
const product_flag_model_1 = require("../../../database/models/product/product-flag/product-flag.model");
const product_color_model_1 = require("../../../database/models/product/product-color/product-color.model");
const product_size_model_1 = require("../../../database/models/product/product-size/product-size.model");
const product_detail_model_1 = require("../../../database/models/product/product-detail/product-detail.model");
const urban_vogue_410216_e4add7f801f7_json_1 = __importDefault(require("../../../../urban-vogue-410216-e4add7f801f7.json"));
// Configuration for the client
const translate = new Translate({
    credentials: urban_vogue_410216_e4add7f801f7_json_1.default,
    projectId: urban_vogue_410216_e4add7f801f7_json_1.default.project_id,
});
const tokenizer = new natural.WordTokenizer();
const stopWords = new Set([
    "em",
    "que",
    "com",
    "para",
    "uma",
    "do",
    "o",
    "a",
    "confeccionada",
    "barato",
    "loja",
    "roupa",
    "moda",
    "especial",
    "estilo",
    "coleção",
    "novidade",
    "promoção",
    "oferta",
    "preço",
    "desconto",
    "venda",
    "produto",
    "marca",
    "tendência",
    "estação",
    "comprar",
    "look",
    "estiloso",
    "fashion",
    "acessório",
    "tamanho",
    "cores",
    "frete",
    "grátis",
    "novidades",
    "coleções",
    "estilos",
    "promoções",
    "ofertas",
    "preços",
    "vendas",
    "produtos",
    "marcas",
    "tendências",
    "estação",
    "compras",
    "looks",
    "estilosos",
    "fashions",
    "acessórios",
    "tamanhos",
    "colorido",
    "coloridos",
    "frete",
    "gratuito",
    "exclusivo",
    "exclusivos",
    "qualidade",
    "última",
    "últimas",
    "último",
    "últimos",
    "ultima",
    "ultimas",
    "ultimo",
    "ultimos",
    "autêntico",
    "autênticos",
    "autêntica",
    "autênticas",
    "original",
    "originais",
    "autenticidade",
    "coleção",
    "colecoes",
    "estação",
    "estacoes",
    "temporada",
    "temporadas",
    "verão",
    "primavera",
    "outono",
    "inverno",
    "veranil",
    "veranis",
    "primaveril",
    "primaveris",
    "outonal",
    "outonais",
    "invernal",
    "invernais",
    "vermelho",
    "vermelhos",
    "vermelha",
    "vermelhas",
    "azul",
    "azuis",
    "amarelo",
    "amarelos",
    "amarela",
    "amarelas",
    "verde",
    "verdes",
    "preto",
    "pretos",
    "preta",
    "pretas",
    "branco",
    "brancos",
    "branca",
    "brancas",
    "sem",
    "linho",
    "de",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
]);
function extrairPalavrasChave(descricao) {
    console.log("função chamada");
    const tokens = tokenizer.tokenize(descricao) || [];
    // Remove stop words
    const tokensFiltrados = tokens.filter((token) => !stopWords.has(token.toLowerCase()));
    // Usa um stemmer para obter as raízes das palavras (opcional)
    const stemmer = natural.PorterStemmer;
    const stems = tokensFiltrados.map((token) => stemmer.stem(token));
    // Conta a frequência das palavras
    const frequenciaPalavras = {};
    stems.forEach((stem) => {
        if (frequenciaPalavras[stem]) {
            frequenciaPalavras[stem]++;
        }
        else {
            frequenciaPalavras[stem] = 1;
        }
    });
    // Ordena as palavras por frequência
    const palavrasOrdenadas = Object.keys(frequenciaPalavras).sort((a, b) => frequenciaPalavras[b] - frequenciaPalavras[a]);
    // Pode ajustar o número de palavras-chave a serem retornadas
    const numeroPalavrasChave = 5;
    const palavrasChave = palavrasOrdenadas.slice(0, numeroPalavrasChave);
    return palavrasChave;
}
const translateText = (text, targetLanguage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let [response] = yield translate.translate(text, targetLanguage);
        return response;
    }
    catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
});
function scraping(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlClone = "https://www.posthaus.com.br/";
        const searchFor = req.params.content;
        try {
            const browser = yield puppeteer.launch({ headless: false });
            const page = yield browser.newPage();
            console.log("Iniciei");
            yield page.goto(`${urlClone}${searchFor}`);
            console.log("Fui para URL");
            const links = yield page.$$eval(".gjhBdY > a", (el) => el.map((link) => link.href));
            for (const link of links) {
                yield processProductLink(link, page);
            }
            setTimeout(() => {
                browser.close();
            }, 3000);
            res.json({ msg: "deu bom" }).status(200);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.scraping = scraping;
function processProductLink(link, page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(link);
        yield page.waitForSelector(".frDydV .ggBivd > .gHwVao");
        yield page.waitForSelector(".sc-bvTASY div div img");
        yield page.waitForSelector("h1");
        yield page.waitForSelector(".bWeRxa");
        yield page.waitForSelector(".sc-jAaTju.cRBfqT");
        yield page.waitForSelector(".sc-kgoBCf.jeIRcN");
        // titulo
        const OldTitle = yield page.$eval("h1", (element) => element.innerHTML);
        const title = yield translateText(OldTitle, "en");
        // preço
        const preco = yield page.$eval(".sc-jAaTju.cRBfqT", (element) => element.innerHTML);
        const formattedPrice = parseFloat((preco === null || preco === void 0 ? void 0 : preco.replace(/&nbsp;|\s|[^\d,.]/g, "").replace("R$", "").replace(",", ".")) || (Math.random() * (200 - 40) + 40).toFixed(2));
        // Formatar o preço para ter sempre o formato "99,99" ou "0,99"
        const price = formattedPrice.toFixed(2);
        // categoria
        const OldCategory = link.split("/")[4];
        const OldCategory2 = yield translateText(OldCategory, "en");
        const category = OldCategory2.toLowerCase().replace(/\s+/g, "-");
        // marca
        const brand = link.split("/")[3];
        // tamanhos
        const sizes = yield page.$$eval(".bWeRxa", (el) => el.map((size) => size.innerHTML));
        const regex = /\s(\d+)x/i;
        // descrição
        const OldSummary = yield page.$eval(".frDydV .ggBivd > .gHwVao", (element) => element.innerHTML);
        const summary = yield translateText(OldSummary, "en");
        // palavras chaves
        const flags = extrairPalavrasChave(summary);
        flags.push(brand, category);
        // imagens
        const images = yield page.$$eval(".sc-bvTASY div div img", (el) => el.map((img) => img.src));
        // detalhes
        const detailsPT = yield page.$$eval(".sc-kgoBCf.jeIRcN", (el) => el.map((p) => p.innerHTML));
        let details = [];
        for (const detail of detailsPT) {
            const detailEN = yield translateText(detail, "en");
            details.push(detailEN);
        }
        // cores
        const getColorName = yield page.$$eval("#colorSelectorRadioBullet_link > span", (el) => el.map((name) => name.innerHTML));
        const colorsPT = getColorName ? getColorName : [];
        let colors = [];
        for (const colorPT of colorsPT) {
            const colorEN = yield translateText(colorPT, "en");
            colorEN.toLowerCase();
            colors.push(colorEN);
        }
        // preço com desconto
        const getPriceDiscont = yield page.$$eval(".LSdgo .daKbcm.sc-ebFjAB.sc-dliRfk label", (el) => el.map((elemento) => elemento.innerHTML));
        const cleanPriceDiscont = getPriceDiscont ? getPriceDiscont : [];
        // pegar o valor com desconto
        const priceDiscont = cleanPriceDiscont
            .map((element) => element.replace(/&nbsp;|\s/g, ""))
            .filter((element) => element.trim() !== "");
        // ver se é parcelavel
        const parcelableLabels = priceDiscont.filter((element) => element.includes("x"));
        const parcelable = parcelableLabels.length > 0;
        // parcelas
        const max_installments = parcelable
            ? parseInt(parcelableLabels[0].replace("x", ""), 10)
            : 1;
        const obj = {
            title,
            price,
            parcelable,
            max_installments,
            priceDiscont,
            flags,
            images,
            summary,
            sizes,
            details,
            colors,
            brand,
            category,
        };
        yield createProductInDatabase(obj);
    });
}
function createProductInDatabase(productInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, price, parcelable, max_installments, flags, images, summary, sizes, details, colors, brand, category, } = productInfo;
        try {
            const quantity = Math.floor(Math.random() * 100) + 1;
            const sold = Math.floor(Math.random() * 200);
            const assessment = Math.floor(Math.random() * 5) + 1;
            const product = (yield product_model_1.default.create({
                title: title,
                summary: summary,
                quantidy: quantity,
                sold: sold,
                price: price,
                state: true,
                category: category,
                brand: brand,
                guarantee: "Warranty: 3 months of coverage by Urban Vogue.",
                assessment: assessment,
                qtd_assessment: 10,
                parcelable: parcelable,
                max_installments: max_installments,
                interest_rate: 23.0,
            }));
            if (!product) {
                throw new Error("Erro na criação do produto");
            }
            for (const url of images) {
                const imageCreate = (yield product_image_model_1.ProductImageM.create({
                    product_id: product.id,
                    url: url,
                }));
                if (!imageCreate) {
                    throw new Error("Erro na criação da imagem");
                }
            }
            for (const flag of flags) {
                const flagCreate = (yield product_flag_model_1.ProductFlagM.create({
                    product_id: product.id,
                    flag: flag,
                }));
                if (!flagCreate) {
                    throw new Error("Erro na criação da flag");
                }
            }
            for (const color of colors) {
                const colorCreate = (yield product_color_model_1.ProductColorM.create({
                    product_id: product.id,
                    name_color: color,
                }));
                if (!colorCreate) {
                    throw new Error("Erro na criação da imagem");
                }
            }
            for (const size of sizes) {
                const sizeCreate = (yield product_size_model_1.ProductSizeM.create({
                    product_id: product.id,
                    size: size,
                }));
                if (!sizeCreate) {
                    throw new Error("Erro na criação da imagem");
                }
            }
            for (const detail of details) {
                const detailCreate = (yield product_detail_model_1.ProductDetailM.create({
                    product_id: product.id,
                    detail: detail,
                }));
                if (!detailCreate) {
                    throw new Error("Erro na criação da imagem");
                }
            }
            console.log("produto adicionado");
        }
        catch (error) {
            console.error(error);
        }
    });
}
