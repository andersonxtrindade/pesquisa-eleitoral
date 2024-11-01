import * as pesquisaService from "../services/pesquisaService.js";

export async function importAndInsertSearchCsv(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ message: "Nenhum arquivo CSV foi enviado." });
    }

    await pesquisaService.importCsv(file.buffer);
    res.status(200).json({
      message: "Dados de pesquisa foram inseridos com sucesso na base!",
    });
  } catch (error) {
    console.error("Erro ao popular:", error);
    res
      .status(500)
      .json({ message: "Erro ao popular dados de pesquisa", error });
  }
}

export async function getPesquisas(req, res) {
  const { id_pesquisa, municipio, estado } = req.query;

  try {
    const results = await pesquisaService.getFilteredPesquisas({
      id_pesquisa,
      municipio,
      estado,
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar dados das pesquisas" });
  }
}

export async function getAllPesquisasIdsController(req, res) {
  try {
    const results = await pesquisaService.getAllPesquisasIds();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar dados das pesquisas" });
  }
}
