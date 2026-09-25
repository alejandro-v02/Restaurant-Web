/**
 * Un restaurante corre esto en su propia red WiFi, no en internet
 * publico. Ademas de la lista explicita de CORS_ORIGINS, se acepta
 * cualquier origen que venga de una IP de red local (celulares de
 * meseros, TV de cocina, etc. conectados al mismo router), para no
 * tener que reconfigurar el backend cada vez que cambia la IP.
 */
export function esOrigenPermitido(origin: string, origenesPermitidos: string[]): boolean {
  if (origenesPermitidos.includes(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'localhost' ||
      /^127\./.test(hostname) ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname)
    );
  } catch {
    return false;
  }
}
