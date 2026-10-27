import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  carregaPagina,
  fechaPagina,
  pegaErros,
} from "./helpers/carregaPagina.js";

describe("agenda.html", () => {
  let window;
  let document;

  beforeEach(async () => {
    window = await carregaPagina("agenda/agenda.html");
    document = window.document;
  });

  afterEach(() => {
    fechaPagina(window);
  });

  const dispara = (elemento, tipo) =>
    elemento.dispatchEvent(new window.MouseEvent(tipo, { bubbles: true }));

  describe("publicidade", () => {
    it("mostra a mensagem e escurece a imagem quando o mouse entra", () => {
      dispara(document.getElementById("publicidade-container"), "mouseenter");

      const mensagem = document.getElementById("publicidade-falsa");
      expect(mensagem.textContent).toBe("Publicidade falsa para fins educativos!");
      expect(document.getElementById("publicidade").style.filter).toBe(
        "brightness(0.25)"
      );
    });

    it("remove a mensagem e o filtro quando o mouse sai", () => {
      const container = document.getElementById("publicidade-container");

      dispara(container, "mouseenter");
      dispara(container, "mouseleave");

      expect(document.getElementById("publicidade-falsa")).toBeNull();
      expect(document.getElementById("publicidade").style.filter).toBe("none");
    });
  });

  describe("seleção de endereço", () => {
    it.each([
      ["bela-vista", "endereco-1"],
      ["moinhos-de-vento", "endereco-2"],
    ])("pinta o fundo de '%s' ao focar e restaura ao sair", (radio, item) => {
      const input = document.getElementById(radio);
      const li = document.getElementById(item);

      input.focus();
      expect(li.style.backgroundColor).toBe("gray");

      input.blur();
      expect(li.style.backgroundColor).toBe("black");
    });

    it("exige a escolha de um endereço", () => {
      const form = document.querySelector("form.endereco");
      expect(form.checkValidity()).toBe(false);

      document.getElementById("bela-vista").checked = true;
      expect(form.checkValidity()).toBe(true);
    });
  });

  describe("horários de funcionamento", () => {
    const celulas = () =>
      ["a-0", "a-1", "a-2", "b-0", "b-1", "b-2"].map((sufixo) =>
        document.getElementById(`horario-${sufixo}`).textContent
      );

    const portugues = [
      "Terça/Sexta",
      "08:00/11:30",
      "13:00/21:30",
      "Sábado/Segunda",
      "Fechado",
      "Fechado",
    ];
    const ingles = [
      "Tuesday/Friday",
      "08:00am/11:30am",
      "01:00pm/09:30pm",
      "Saturday/Monday",
      "Closed",
      "Closed",
    ];

    // problema conhecido: o h2 tem quebras de linha e espaços ao redor do texto
    // no HTML, então o textContent não é igual a "Horários:" e a função cai no
    // else. quando o HTML for corrigido o teste falha: apague o teste
    it("problema conhecido: o primeiro duplo clique não traduz", () => {
      const titulo = document.getElementById("horarios-titulo");

      dispara(titulo, "dblclick");
      expect(titulo.textContent).toBe("Horários:");
      expect(celulas()).toEqual(portugues);

      dispara(titulo, "dblclick");
      expect(titulo.textContent).toBe("Hours:");
      expect(celulas()).toEqual(ingles);
    });

    it("alterna entre português e inglês a cada duplo clique", () => {
      const titulo = document.getElementById("horarios-titulo");
      const tabela = document.getElementById("horario-table");
      titulo.textContent = "Horários:";

      dispara(titulo, "dblclick");
      expect(titulo.textContent).toBe("Hours:");
      expect(celulas()).toEqual(ingles);
      expect(tabela.style.backgroundColor).toBe("dimgray");

      dispara(titulo, "dblclick");
      expect(titulo.textContent).toBe("Horários:");
      expect(celulas()).toEqual(portugues);
      expect(tabela.style.backgroundColor).toBe("transparent");
    });
  });

  describe("formulário de agendamento", () => {
    const form = () => document.querySelector("form.dados");

    it("não é válido enquanto os campos obrigatórios estão vazios", () => {
      const invalidos = [...form().elements]
        .filter((campo) => !campo.validity.valid)
        .map((campo) => campo.id);

      expect(form().checkValidity()).toBe(false);
      expect(invalidos).toEqual(["nome", "idade", "data", "horario", "sim", "nao"]);
    });

    it("é válido com os campos obrigatórios preenchidos", () => {
      document.getElementById("nome").value = "Carlos";
      document.getElementById("idade").value = "30";
      document.getElementById("data").value = "2025-12-01";
      document.getElementById("horario").value = "10:00";
      document.getElementById("nao").checked = true;

      expect(form().checkValidity()).toBe(true);
    });

    it("não exige as observações", () => {
      expect(document.getElementById("observacoes").required).toBe(false);
    });

    // problema conhecido: o botão Agendar chama mostraModalSucesso() no onclick,
    // mas a função não existe em nenhum arquivo do projeto. quando ela for
    // criada o teste falha: troque por um teste do comportamento da função
    it("problema conhecido: Agendar chama uma função inexistente", () => {
      form().querySelector("button[type=submit]").click();

      const erros = pegaErros(window);
      expect(erros).toHaveLength(1);
      expect(erros[0]).toContain("mostraModalSucesso is not defined");
    });
  });
});
