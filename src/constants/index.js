export const API_BASE = "/unife";
export const TEST_ENDPOINT = "/lotti";
export const LS_USER = "t4a_unife_user"; // DA ELIMINARE!
export const LS_PASS = "t4a_unife_pass"; // DA ELIMINARE!

export const FASE_PREFIX = {
  APPEZZAMENTO:         "presemina_appezzamento-",
  LAVORAZIONI:          "presemina_lavorazioni-",
  ACQUISIZIONE_VARIETA: "presemina_acquisizionevarieta-",
  SEMINA:               "presemina_semina-",
  TREBBIATURA:          "raccolta_trebbiatura-",
  TRASPORTO_RACCOLTA:   "raccolta_trasporto-",
  SCARICO:              "raccolta_scarico-",
  SILOS:                "raccolta_silos-",
  LOTTO_STOCCAGGIO:     "stoccaggio_lotto-",
  TRASPORTO_STOCCAGGIO: "stoccaggio_trasporto-",
  CONSEGNA:             "stoccaggio_consegna-",
};

export const FASE_LABEL = {
  APPEZZAMENTO:         "Appezzamento",
  LAVORAZIONI:          "Lavorazioni",
  ACQUISIZIONE_VARIETA: "Acquisizione Varietà",
  SEMINA:               "Semina",
  TREBBIATURA:          "Trebbiatura",
  TRASPORTO_RACCOLTA:   "Trasporto",
  SCARICO:              "Scarico",
  SILOS:                "Silos",
  LOTTO_STOCCAGGIO:     "Lotto",
  TRASPORTO_STOCCAGGIO: "Trasporto",
  CONSEGNA:             "Consegna",
};

export const FASI_PRESEMINA  = ["APPEZZAMENTO", "LAVORAZIONI", "ACQUISIZIONE_VARIETA", "SEMINA"];
export const FASI_RACCOLTA   = ["TREBBIATURA", "TRASPORTO_RACCOLTA", "SCARICO", "SILOS"];
export const FASI_STOCCAGGIO = ["LOTTO_STOCCAGGIO", "TRASPORTO_STOCCAGGIO", "CONSEGNA"];

export const BTN_OCRA      = "#C9A227";
export const BTN_OCRA_DARK = "#A67C00";
export const BTN_GREEN     = "#A8C64A";
export const BTN_YELLOW    = "#F5CF71";