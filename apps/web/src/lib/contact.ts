/**
 * Punto único de contacto para sugerencias y mejoras.
 * El número se usa también en el README; mantener ambos sincronizados.
 */
export const WHATSAPP_NUMBER = "51935533845";

const MESSAGE = "Hola, quiero sugerir una mejora para equisproject:";

export const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
