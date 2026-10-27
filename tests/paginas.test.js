import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  carregaPagina,
  fechaPagina,
  paginas,
} from "./helpers/carregaPagina.js";

const TEXTO_ALTERNATIVO = "todas as imagens têm texto alternativo";
const ARQUIVOS_EXISTEM =
  "links, estilos e imagens locais apontam para arquivos que existem";
const MESMOS_LINKS = "tem os mesmos links do menu principal";

// nestas páginas o teste genérico é pulado porque o HTML tem um problema
// conhecido. o problema fica descrito em "problemas conhecidos do HTML"
const problemasConhecidos = {
  "index.html": [ARQUIVOS_EXISTEM, MESMOS_LINKS],
  "galeria/galeria.html": [TEXTO_ALTERNATIVO],
};

// links e arquivos externos não são verificados
const ehExterno = (url) => /^(https?:|data:|mailto:|tel:|#|\/\/)/.test(url);

const imagensSemAlt = (document) =>
  [...document.querySelectorAll("img")]
    .filter((img) => !img.getAttribute("alt")?.trim())
    .map((img) => img.getAttribute("src")?.slice(0, 40));

const hrefs = (document, seletor) =>
  [...document.querySelectorAll(`${seletor} a`)].map((a) =>
    a.getAttribute("href")
  );

// devolve os endereços locais, como estão no HTML, que não levam a um arquivo
const arquivosQuebrados = (window) => {
  const atributos = [
    ["a[href]", "href"],
    ["link[href]", "href"],
    ["img[src]", "src"],
    ["script[src]", "src"],
  ];
  const quebrados = [];

  for (const [seletor, atributo] of atributos) {
    for (const elemento of window.document.querySelectorAll(seletor)) {
      const valor = elemento.getAttribute(atributo);
      if (ehExterno(valor)) continue;

      const url = new URL(valor, window.location.href);
      if (!existsSync(fileURLToPath(url))) quebrados.push(valor);
    }
  }
  return quebrados;
};

describe.each(paginas)("%s", (caminho) => {
  let window;
  let document;

  const teste = (nome, fn) =>
    (problemasConhecidos[caminho]?.includes(nome) ? it.skip : it)(nome, fn);

  beforeEach(async () => {
    window = await carregaPagina(caminho);
    document = window.document;
  });

  afterEach(() => {
    fechaPagina(window);
  });

  it("tem título e idioma pt-BR", () => {
    expect(document.title.trim()).not.toBe("");
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  teste(TEXTO_ALTERNATIVO, () => {
    expect(imagensSemAlt(document)).toEqual([]);
  });

  teste(ARQUIVOS_EXISTEM, () => {
    expect(arquivosQuebrados(window)).toEqual([]);
  });

  describe("menu mobile", () => {
    it("começa fechado", () => {
      const menu = document.getElementById("mobile-menu");

      expect(menu.getAttribute("class")).toBe("mobile-menu-close");
    });

    it("abre ao clicar no ícone do menu e fecha ao clicar no X", () => {
      const menu = document.getElementById("mobile-menu");

      document.querySelector(".menu-icon").click();
      expect(menu.getAttribute("class")).toBe("mobile-menu-open");

      document.querySelector(".close-icon").click();
      expect(menu.getAttribute("class")).toBe("mobile-menu-close");
    });

    teste(MESMOS_LINKS, () => {
      const principal = hrefs(document, ".menu-desktop");

      expect(principal).toHaveLength(5);
      expect(hrefs(document, "#mobile-menu")).toEqual(principal);
    });
  });
});

describe("problemas conhecidos do HTML", () => {
  let window;

  afterEach(() => {
    fechaPagina(window);
  });

  // cada teste descreve o problema como ele é hoje. quando o HTML for
  // corrigido o teste falha: apague o teste e a página de problemasConhecidos
  it("index.html: os links do menu mobile usam ../ e saem do projeto", async () => {
    window = await carregaPagina("index.html");
    const { document } = window;
    const mobile = hrefs(document, "#mobile-menu");

    expect(mobile).toEqual(
      hrefs(document, ".menu-desktop").map((href) => `../${href}`)
    );
    expect(arquivosQuebrados(window)).toEqual(mobile);
  });

  it("galeria.html: as imagens 5 a 8 estão sem texto alternativo", async () => {
    window = await carregaPagina("galeria/galeria.html");

    expect(imagensSemAlt(window.document)).toEqual([
      "img-galeria-05.png",
      "img-galeria-06.png",
      "img-galeria-07.png",
      "img-galeria-08.jpg",
    ]);
  });
});
