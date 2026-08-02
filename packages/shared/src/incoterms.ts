export interface Incoterm {
  code: string;
  name: string;
  description: string;
  sellerObligation: string;
}

export const INCOTERMS: readonly Incoterm[] = [
  {
    code: "EXW",
    name: "Ex Works",
    description: "En fábrica",
    sellerObligation: "El vendedor pone la mercancía a disposición en sus instalaciones. El comprador asume todos los costos y riesgos desde el origen (flete interno, embarque, transporte internacional, aduanas).",
  },
  {
    code: "FCA",
    name: "Free Carrier",
    description: "Franco transportista",
    sellerObligation: "El vendedor entrega la mercancía al transportista designado por el comprador en un punto acordado. El comprador paga el transporte principal y el seguro.",
  },
  {
    code: "FAS",
    name: "Free Alongside Ship",
    description: "Franco al costado del buque",
    sellerObligation: "El vendedor coloca la mercancía al costado del buque en el puerto de embarque. El comprador paga el flete marítimo, seguro y costos de descarga.",
  },
  {
    code: "FOB",
    name: "Free on Board",
    description: "Franco a bordo",
    sellerObligation: "El vendedor entrega la mercancía a bordo del buque en el puerto de origen. El comprador paga el flete marítimo internacional y el seguro.",
  },
  {
    code: "CFR",
    name: "Cost and Freight",
    description: "Costo y flete",
    sellerObligation: "El vendedor paga el transporte hasta el puerto de destino. El riesgo se transfiere cuando la mercancía está a bordo en origen. El comprador paga el seguro.",
  },
  {
    code: "CIF",
    name: "Cost, Insurance & Freight",
    description: "Costo, seguro y flete",
    sellerObligation: "El vendedor paga el flete y el seguro hasta el puerto de destino. El riesgo se transfiere en origen cuando la mercancía está a bordo.",
  },
  {
    code: "CPT",
    name: "Carriage Paid To",
    description: "Transporte pagado hasta",
    sellerObligation: "El vendedor paga el transporte hasta el destino convenido. El riesgo se transfiere al entregar al primer transportista. El comprador paga el seguro.",
  },
  {
    code: "CIP",
    name: "Carriage & Insurance Paid To",
    description: "Transporte y seguro pagados hasta",
    sellerObligation: "El vendedor paga el transporte y el seguro hasta el destino convenido. Cubre todo el transporte incluyendo el seguro.",
  },
  {
    code: "DAP",
    name: "Delivered at Place",
    description: "Entregado en lugar",
    sellerObligation: "El vendedor entrega la mercancía en el destino final, lista para descarga. El comprador solo se encarga de la descarga y las aduanas de importación.",
  },
  {
    code: "DPU",
    name: "Delivered at Place Unloaded",
    description: "Entregado en lugar descargado",
    sellerObligation: "El vendedor entrega la mercancía descargada en el destino final. El comprador se encarga de las aduanas de importación.",
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid",
    description: "Entregado con derechos pagados",
    sellerObligation: "El vendedor cubre todos los costos incluyendo impuestos y aranceles de importación. Es la máxima obligación del vendedor.",
  },
] as const;

export function getIncoterm(code: string): Incoterm | undefined {
  return INCOTERMS.find((i) => i.code === code);
}
