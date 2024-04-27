require("dotenv").config();
import { Request, Response } from "express";
const { Translate } = require("@google-cloud/translate").v2;
import * as puppeteer from "puppeteer";
import * as natural from "natural";
import ProductM from "../../../models/product/product.model";
import { ProductImageM } from "../../../models/product/product-image/product-image.model";
import { ProductColorI, ProductDetailI, ProductFlagI, ProductI, ProductImageI, ProductSizeI } from "../../../interfaces/product.interface";
import { ProductFlagM } from "../../../models/product/product-flags/product-flags.model";
import { ProductColorM } from "../../../models/product/product-color/product-color.model";
import { ProductSizeM } from "../../../models/product/product-size/product-size.model";
import { ProductDetailM } from "../../../models/product/product-detail/product-detail.model";
import CREDENTIALS from "../../../../urban-vogue-410216-e4add7f801f7.json"

// Configuration for the client
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
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
    console.log(searchFor);
  
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
    await page.waitForSelector(".sc-jAaTju.cRBfqT");
    await page.waitForSelector(".sc-kgoBCf.jeIRcN");
    // titulo
    const OldTitle = await page.$eval(
      "h1",
      (element) => element.innerHTML
    );
    const title = await translateText(OldTitle, "en");
    // preço
    const preco = await page.$eval(".sc-jAaTju.cRBfqT", (element) => element.innerHTML);
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
  
    console.log(price);
  
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
    console.log(detailsPT);
    
  
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
    console.log(details);
  
    try {
      const quantity = Math.floor(Math.random() * 100) + 1;
      const sold = Math.floor(Math.random() * 200);
      console.log(sold, quantity);
  
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
        console.log("imagem criada");
      }
      for (const flag of flags) {
        const flagCreate = (await ProductFlagM.create({
          product_id: product.id,
          flag: flag,
        })) as ProductFlagI;
  
        if (!flagCreate) {
          throw new Error("Erro na criação da flag");
        }
        console.log("flag criada");
      }
      for (const color of colors) {
        const colorCreate = (await ProductColorM.create({
          product_id: product.id,
          name_color: color,
        })) as ProductColorI;
  
        if (!colorCreate) {
          throw new Error("Erro na criação da imagem");
        }
        console.log("cor criada");
      }
      for (const size of sizes) {
        const sizeCreate = (await ProductSizeM.create({
          product_id: product.id,
          size: size,
        })) as ProductSizeI;
  
        if (!sizeCreate) {
          throw new Error("Erro na criação da imagem");
        }
        console.log("size criada");
      }
      for (const detail of details) {
        const detailCreate = (await ProductDetailM.create({
          product_id: product.id,
          detail: detail,
        })) as ProductDetailI;
  
        if (!detailCreate) {
          throw new Error("Erro na criação da imagem");
        }
        console.log("detail criada");
      }
      /*rever videos sobre relação de tabela e mudar o schema talvez*/
      console.log("produto adicionado");
    } catch (error) {
      console.error(error);
    }
  }
  export {scraping};