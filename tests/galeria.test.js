import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { carregaPagina, fechaPagina, raiz } from "./helpers/carregaPagina.js";

describe("galeria.html", () => {
  let window;
  let document;

  beforeEach(async () => {
    window = await carregaPagina("galeria/galeria.html");
    document = window.document;
  });

  afterEach(() => {
    fechaPagina(window);
  });

  const dispara = (elemento, tipo) =>
    elemento.dispatchEvent(new window.MouseEvent(tipo, { bubbles: true }));

  it("a imagem alternativa existe", () => {
    expect(existsSync(resolve(raiz, "galeria/outra-imagem.jpg"))).toBe(true);
  });

  it("troca a imagem enquanto o botão do mouse está pressionado", () => {
    const imagens = [...document.querySelectorAll("img[onmousedown]")];
    expect(imagens.length).toBeGreaterThan(0);

    for (const img of imagens) {
      const original = img.getAttribute("src");

      dispara(img, "mousedown");
      expect(img.getAttribute("src"), img.id).toBe("outra-imagem.jpg");

      dispara(img, "mouseup");
      expect(img.getAttribute("src"), img.id).toBe(original);
    }
  });

  it("cada imagem só altera a si mesma", () => {
    const [primeira, ...outras] = document.querySelectorAll("img[onmousedown]");
    const antes = outras.map((img) => img.getAttribute("src"));

    dispara(primeira, "mousedown");

    expect(outras.map((img) => img.getAttribute("src"))).toEqual(antes);
  });

  it("incorpora 2 vídeos do YouTube", () => {
    const videos = [...document.querySelectorAll("iframe")];

    expect(videos).toHaveLength(2);
    for (const video of videos) {
      expect(video.getAttribute("src")).toMatch(/youtube/);
    }
  });
});
