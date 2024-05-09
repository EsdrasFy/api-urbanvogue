require("dotenv").config();
import { Request, Response } from "express";
const { Translate } = require("@google-cloud/translate").v2;
import * as puppeteer from "puppeteer";
import * as natural from "natural";
import ProductM from "../../../database/models/product/product.model";
import { ProductImageM } from "../../../database/models/product/product-image/product-image.model";
import { ProductColorI, ProductDetailI, ProductFlagI, ProductI, ProductImageI, ProductSizeI } from "../../../interfaces/product.interface";
import { ProductFlagM } from "../../../database/models/product/product-flag/product-flag.model";
import { ProductColorM } from "../../../database/models/product/product-color/product-color.model";
import { ProductSizeM } from "../../../database/models/product/product-size/product-size.model";
import { ProductDetailM } from "../../../database/models/product/product-detail/product-detail.model";

const translate = new Translate({
  projectId: "urbanvogue",
  credentials: {
    client_email: "urbanvogue@urbanvogue.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCTcOXbMVkAFtz9\n0X2hcAVZaVNZRO1DW83iKj2rRQceccY48CoEInlKulQEYeAZYF99mDB+8OJlz+lv\n+c8mVjHVzA1uHIVq8cmUD4r+ZMvmKls0xHqAKHbVpZh8CB0USa51q5B+ILow2gQn\nQBAMf/MbgCvC7ZcahLC0FD7MrjOMp061Bsak3OxUx17ZV34M/VeDn+2TyEPAq6C9\ndsEogco9ZZTCd6Typ9x9ICehEEeAd+Dd7rNPOhzu6f8RS0cxkD3QuMEOkK5gDHbZ\nIzdTInDmlTyW+ZjlGH/xMmREqcqGzprpzeqx2lWUXN7k3qZ2zLWxj6Paaw6nVUI9\nC8Kwz4/NAgMBAAECggEADIOgFs8k8TN/lVGDGsExywl8CA8oHjf8DQ6txkwpEwXw\nH6QOxOQSLGwNNoQCK9U4taXFs/iJFsAjXZwz31qghzd3CloEXvPfup/pGbd/cO02\naY+loBwPHgocm6ZqpW6tjpI9xN7NPtk6UgSHeDAh97sUu8pDsX4Cq34uaFv+xxjJ\nQfTjY0btDNmaSla+QDxpSYDG2aDxmIeW5VlaFf7lxONoNaH2/oCvB/voEPLrICkX\nO0uR6bB2zEB/KztC2jqgrPu+gjjnQJgdtPH4GdLqLX4KWGCzm0LBAeOXFneQhp0z\n6sPTPEFzejnIR+VvqqSgkpKs9hVSLOMk6u2BlTNoxwKBgQDGqAKDTCVdT8uZ4g95\nK/5dMoL3H0qODc2tpeB7AMHYKZUV2IqnNR0GH3Dt+KXDEg5LvVNrnhTwCFA2o5TQ\nZNVdKipf5qI21U0QthVp5jOlViR4AO4ROPDQ04jzszEmQ+dChoP8nzKapuiYMY+4\n9OeHSdgiyvifRj+W//KpQr95gwKBgQC+AEL/tXvgHxI4zqRWBHjMWCbRevd5klIR\nVOxuXOgQpWvi2YiiIlir20J4yMspO/BXXtaMI3Kb2dyoP5QU12KWevQc0GyAK9r5\nwE36iX0wSeapdaqD7GLDujPsIs2fWgrfiMk0ga0DFSjeOKAbx4OC/DhL5HjX4v3K\nzohVzUigbwKBgDyJSDLAioZT4aRkCfkP2fSGhvhNdceyFyI6cRyqj2eSzFaa5S2s\n9so93Ij4A3NdVjPoXrplstWugtsToC6c+5PnXIBa5MW23EQiaIYb21Mf2/8hsWpY\nIrJQM+Snj2ust5VDLodV7/LGuAxg1f4zyzYj35RCq97FZm1aU5UWvQiHAoGBAIDx\n8oZR52ECFT7CVtsdq9GanbWbC2rRN6sVhGOd38y0R1SsJ0NJpf30DtekBeTVDdZt\nwZNX10cYAt2YUGoYhorzpMoNVSVjHfhTX1iBiJmF/enRtkhT2+9TZjuCnyPfWvO7\nhDmDLCSkbpjpuxc/PuxdOeOfibeSEIVbx0Db0cc3AoGAY9IgXq/Ejca0jYs7UdVW\nH/aTdJDn5vth6P51KjpAhXqIRFE9MIHGSTQJvHaILbAucksXVa0YvJucT3gqhblW\n1qI3DqEs26N1ruu44hRLdqlF9o8cvKd6HqQy4mJ4YpF67c4CRiw4KcjOy6QW8rAs\nvusls6tTfgRErEUoFIHXu4g=\n-----END PRIVATE KEY-----\n",
  },
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
function extrairPalavrasChave(descricao: string): string[] {
    console.log("função chamada");
  
    const tokens: string[] = tokenizer.tokenize(descricao) || [];
  
    // Remove stop words
    const tokensFiltrados = tokens.filter(
      (token: string) => !stopWords.has(token.toLowerCase())
    );
  
    // Usa um stemmer para obter as raízes das palavras (opcional)
    const stemmer = natural.PorterStemmer;
    const stems: string[] = tokensFiltrados.map((token: string) =>
      stemmer.stem(token)
    );
  
    // Conta a frequência das palavras
    const frequenciaPalavras: { [key: string]: number } = {};
    stems.forEach((stem: string) => {
      if (frequenciaPalavras[stem]) {
        frequenciaPalavras[stem]++;
      } else {
        frequenciaPalavras[stem] = 1;
      }
    });
  
    // Ordena as palavras por frequência
    const palavrasOrdenadas: string[] = Object.keys(frequenciaPalavras).sort(
      (a, b) => frequenciaPalavras[b] - frequenciaPalavras[a]
    );
    // Pode ajustar o número de palavras-chave a serem retornadas
  
    const numeroPalavrasChave: number = 5;
  
    const palavrasChave: string[] = palavrasOrdenadas.slice(
      0,
      numeroPalavrasChave
    );
  
    return palavrasChave;
  }
  const translateText = async (text: string, targetLanguage: string) => {
    try {
      let [response] = await translate.translate(text, targetLanguage);
      return response;
    } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
    }
  };
  async function scraping(req: Request, res: Response) {
    const urlClone = "https://www.posthaus.com.br/";
  
    const searchFor = req.params.content;
  
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      console.log("Iniciei");
  
      await page.goto(`${urlClone}${searchFor}`);
      console.log("Fui para URL");
  
      const links = await page.$$eval(".gjhBdY > a", (el) =>
        el.map((link) => link.href)
      );
  
      for (const link of links) {
        await processProductLink(link, page);
      }
      setTimeout(() => {
        browser.close();
      }, 3000);
      res.json({ msg: "deu bom" }).status(200);
    } catch (error) {
      console.log(error);
    }
  }
  async function processProductLink(link: string, page: puppeteer.Page) {
    await page.goto(link);
    await page.waitForSelector(".frDydV .ggBivd > .gHwVao");
    await page.waitForSelector(".sc-bvTASY div div img");
    await page.waitForSelector("h1");
    await page.waitForSelector(".bWeRxa");
    await page.waitForSelector(".sc-jWBwVP.sc-cMljjf.sc-jAaTju");
    await page.waitForSelector(".sc-kgoBCf.jeIRcN");
    // titulo
    const OldTitle = await page.$eval(
      "h1",
      (element) => element.innerHTML
    );
    const title = await translateText(OldTitle, "en");
    // preço
    const preco = await page.$eval(".sc-jWBwVP.sc-cMljjf.sc-jAaTju", (element) => element.innerHTML);
    const formattedPrice = parseFloat(
      preco
        ?.replace(/&nbsp;|\s|[^\d,.]/g, "")
        .replace("R$", "")
        .replace(",", ".") || (Math.random() * (200 - 40) + 40).toFixed(2)
    );
  
    // Formatar o preço para ter sempre o formato "99,99" ou "0,99"
    const price = formattedPrice.toFixed(2);
  
    // categoria
    const OldCategory = link.split("/")[4];
    const OldCategory2 = await translateText(OldCategory, "en");
  
    const category = OldCategory2.toLowerCase().replace(/\s+/g, "-");
  
    // marca
    const brand = link.split("/")[3];
    // tamanhos
    const sizes = await page.$$eval(".bWeRxa", (el) =>
      el.map((size) => size.innerHTML)
    );
    const regex: RegExp = /\s(\d+)x/i;
    // descrição
    
    const OldSummary = await page.$eval(
      ".frDydV .ggBivd > .gHwVao",
      (element) => element.innerHTML
    );
    
    const summary = await translateText(OldSummary, "en");
    // palavras chaves
    const flags: string[] = extrairPalavrasChave(summary);
    flags.push(brand, category);
    // imagens
    const images = await page.$$eval(".sc-bvTASY div div img", (el) =>
      el.map((img) => img.src)
    );
    // detalhes
    const detailsPT = await page.$$eval(".sc-kgoBCf.jeIRcN", (el) =>
      el.map((p) => p.innerHTML)
    );

    let details: string[] = [];
  
    for (const detail of detailsPT) {
      const detailEN = await translateText(detail, "en");
      details.push(detailEN);
    }
  
    // cores
    const getColorName = await page.$$eval(
      "#colorSelectorRadioBullet_link > span",
      (el) => el.map((name) => name.innerHTML)
    );
    const colorsPT = getColorName ? getColorName : [];
    let colors: string[] = [];
    for (const colorPT of colorsPT) {
      const colorEN = await translateText(colorPT, "en");
      colorEN.toLowerCase();
      colors.push(colorEN);
    }
    // preço com desconto
    const getPriceDiscont = await page.$$eval(
      ".LSdgo .daKbcm.sc-ebFjAB.sc-dliRfk label",
      (el) => el.map((elemento) => elemento.innerHTML)
    );
    const cleanPriceDiscont = getPriceDiscont ? getPriceDiscont : [];
    // pegar o valor com desconto
    const priceDiscont: string[] = cleanPriceDiscont
      .map((element) => element.replace(/&nbsp;|\s/g, ""))
      .filter((element) => element.trim() !== "");
    // ver se é parcelavel
    const parcelableLabels = priceDiscont.filter((element) =>
      element.includes("x")
    );
  
    const parcelable = parcelableLabels.length > 0;
  
    // parcelas
  
    const max_installments: number = parcelable
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
    await createProductInDatabase(obj);
  }
  
  async function createProductInDatabase(productInfo: any) {
    const {
      title,
      price,
      parcelable,
      max_installments,
      flags,
      images,
      summary,
      sizes,
      details,
      colors,
      brand,
      category,
    } = productInfo;
  
    try {
      const quantity = Math.floor(Math.random() * 100) + 1;
      const sold = Math.floor(Math.random() * 200);
  
      const assessment = Math.floor(Math.random() * 5) + 1;
  
      const product = (await ProductM.create({
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
      })) as ProductI;
      if (!product) {
        throw new Error("Erro na criação do produto");
      }
      for (const url of images) {
        const imageCreate = (await ProductImageM.create({
          product_id: product.id,
          url: url,
        })) as ProductImageI;
        if (!imageCreate) {
          throw new Error("Erro na criação da imagem");
        }

      }
      for (const flag of flags) {
        const flagCreate = (await ProductFlagM.create({
          product_id: product.id,
          flag: flag,
        })) as ProductFlagI;
  
        if (!flagCreate) {
          throw new Error("Erro na criação da flag");
        }
        
      }
      for (const color of colors) {
        const colorCreate = (await ProductColorM.create({
          product_id: product.id,
          name_color: color,
        })) as ProductColorI;
  
        if (!colorCreate) {
          throw new Error("Erro na criação da imagem");
        }
     
      }
      for (const size of sizes) {
        const sizeCreate = (await ProductSizeM.create({
          product_id: product.id,
          size: size,
        })) as ProductSizeI;
  
        if (!sizeCreate) {
          throw new Error("Erro na criação da imagem");
        }
       
      }
      for (const detail of details) {
        const detailCreate = (await ProductDetailM.create({
          product_id: product.id,
          detail: detail,
        })) as ProductDetailI;
  
        if (!detailCreate) {
          throw new Error("Erro na criação da imagem");
        }
       
      }
      console.log("produto adicionado");
    } catch (error) {
      console.error(error);
    }
  }
  export {scraping};