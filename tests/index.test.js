import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { carregaPagina, fechaPagina } from "./helpers/carregaPagina.js";

describe("index.html", () => {
  let window;
  let document;

  beforeEach(async () => {
    // só o setTimeout é falso, pra não travar o evento load
    vi.useFakeTimers({ toFake: ["setTimeout"] });
    window = await carregaPagina("index.html");
    document = window.document;
  });

  afterEach(() => {
    fechaPagina(window);
    vi.useRealTimers();
  });

  describe("promoção", () => {
    it("aparece 1 segundo depois de carregar a página", () => {
      const promocao = document.getElementById("promocao");

      vi.advanceTimersByTime(999);
      expect(promocao.style.visibility).not.toBe("visible");

      vi.advanceTimersByTime(1);
      expect(promocao.style.visibility).toBe("visible");
      expect(promocao.style.marginTop).toBe("0rem");
    });

    it.each(["Vou Pensar", "Quero Participar"])(
      "some da página ao clicar em '%s'",
      (texto) => {
        const botao = [...document.querySelectorAll("#promocao button")].find(
          (b) => b.textContent.trim() === texto
        );

        botao.click();

        expect(document.getElementById("promocao")).toBeNull();
      }
    );
  });

  it("mostra os 4 GIFs da seção principal", () => {
    expect(document.querySelectorAll("img.gif")).toHaveLength(4);
  });
});
