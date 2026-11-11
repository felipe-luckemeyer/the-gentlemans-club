import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";
import { expect } from "vitest";

export const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export const paginas = [
  "index.html",
  "quem-somos/quem-somos.html",
  "galeria/galeria.html",
  "avaliacoes/avaliacoes.html",
  "premiacoes/premiacoes.html",
  "agenda/agenda.html",
];

const errosPorJanela = new WeakMap();

// carrega a página no jsdom executando os scripts inline.
// imagens, fontes, mapa e vídeos não são baixados (resources não é informado)
export async function carregaPagina(caminho) {
  const arquivo = resolve(raiz, caminho);
  const erros = [];

  // erros dos scripts da página, como função não definida, chegam aqui
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (erro) => erros.push(erro.message));

  const dom = new JSDOM(readFileSync(arquivo, "utf8"), {
    runScripts: "dangerously",
    url: pathToFileURL(arquivo).href,
    virtualConsole,
  });
  const { window } = dom;
  errosPorJanela.set(window, erros);

  // espera o evento load, que dispara o onload do body
  if (window.document.readyState !== "complete") {
    await new Promise((pronto) => window.addEventListener("load", pronto));
  }
  return window;
}

// devolve os erros de script ocorridos até agora e esquece eles
export function pegaErros(window) {
  return errosPorJanela.get(window).splice(0);
}

// fecha a página e falha o teste se sobrou algum erro de script
export function fechaPagina(window) {
  if (!window) return;

  const erros = pegaErros(window);
  window.close();
  expect(erros, "erros de script na página").toEqual([]);
}
