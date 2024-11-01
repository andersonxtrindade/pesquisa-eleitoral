import * as localidadesService from "../services/localidadesService.js";

export async function populate(req, res) {
  const { ano } = req.query;

  try {
    await localidadesService.populateDatabase(ano);
    res
      .status(200)
      .json({
        message:
          "Dados de munícipios com população e estados foram atualizados com sucesso!",
      });
  } catch (error) {
    console.error("Erro ao popular:", error);
    res
      .status(500)
      .json({ message: "Erro ao popular munícipios e estados", error });
  }
}

export async function getPopulationPeriods(req, res) {
  try {
    const periods = await localidadesService.fetchPopulationPeriods();
    res.status(200).json(periods);
  } catch (error) {
    console.error("Erro ao obter períodos de população:", error);
    res
      .status(500)
      .json({ message: "Erro ao obter períodos de população", error });
  }
}

export async function getAllStates(req, res) {
  try {
    const periods = await localidadesService.getAllStates();
    res.status(200).json(periods);
  } catch (error) {
    console.error("Erro ao obter os estados:", error);
    res
      .status(500)
      .json({ message: "Erro ao obter os estados", error });
  }
}

export async function getCityByState(req, res) {
  const { estado } = req.query;

  try {
    const periods = await localidadesService.getCityByState(estado);
    res.status(200).json(periods);
  } catch (error) {
    console.error("Erro ao obter as cidades:", error);
    res
      .status(500)
      .json({ message: "Erro ao obter as cidades", error });
  }
}
