import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "equisproject — Aplicaciones logísticas para importación en Perú",
  "/apps/import-calculator": "Calculadora de Importación — CIF, IGV, IPM | equisproject",
  "/apps/qr-generator": "Generador QR y Código de Barra | equisproject",
  "/apps/unit-converter": "Conversor de Unidades — Peso, Volumen | equisproject",
  "/apps/packing-list": "Packing List — Generador de PDF | equisproject",
  "/apps/incoterm-compare": "Comparador de Incoterms 2020 | equisproject",
};

const descriptions: Record<string, string> = {
  "/": "Herramientas gratuitas para importación en Perú: calculadora de impuestos, QR/barcode, conversor de unidades, packing list y comparador de Incoterms.",
  "/apps/import-calculator": "Calcula el costo total de importación en Perú: CIF, Ad Valorem, IGV Aduana, IPM, ISC y Percepción con tipo de cambio SUNAT en tiempo real.",
  "/apps/qr-generator": "Genera códigos QR o de barra (CODE128, EAN-13, UPC) con marco personalizado. Exporta en PNG y PDF.",
  "/apps/unit-converter": "Convierte entre unidades de peso, volumen, longitud y temperatura para operaciones de envío y logística.",
  "/apps/packing-list": "Genera una lista de empaque profesional en PDF con dimensiones, peso y volumen para exportación.",
  "/apps/incoterm-compare": "Compara los 11 Incoterms® 2020: riesgos, costos, responsabilidades de vendedor y comprador.",
};

export function useSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titles[pathname] || "equisproject";

    const desc = descriptions[pathname] || descriptions["/"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc) {
      metaDesc.setAttribute("content", desc);
    }

    const title = titles[pathname] || titles["/"];
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute("content", title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && desc) {
      ogDesc.setAttribute("content", desc);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", `https://equisproject.online${pathname}`);
    }
  }, [pathname]);
}
