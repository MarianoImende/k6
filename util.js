import { randomBytes } from 'k6/crypto';
import encoding from 'k6/encoding';
// Fecha UTC en formato ISO con milisegundos .000Z común y necesario en algunos bodys SOAPS
export function CREATED() {
    const now = new Date();
    return new Date().toISOString();
}
// NONCE en base64 usando randomBytes común y necesario en algunos bodys SOAPS
export function getNONCE() {
    const bytes = randomBytes(16);  // devuelve ArrayBuffer
    return encoding.b64encode(bytes);
}

// UUIDv4 sin librerías externas, un valor común en los headers o body.
export function REQUERIMIENTO() {
    //usa: uuidv4
    const raw = randomBytes(16);
    const bytes = new Uint8Array(raw);

    // Seteo de bits según RFC 4122 para UUIDv4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

    // Rndom clasico
export function randomIntBetween(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Devuelve un objeto headers con Authorization básico en base64
   * @param {string} user - nombre de usuario
   * @param {string} pass - contraseña
   * @returns {object} - objeto headers con Authorization
   */
  export function getBasicAuthHeader(user, pass) {
      const auth = `${user}:${pass}`;
      const encoded = encoding.b64encode(auth);
      return {
          'Authorization': `Basic ${encoded}`
      };
  }
