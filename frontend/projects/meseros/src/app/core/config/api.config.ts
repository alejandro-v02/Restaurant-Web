// El backend siempre corre en el puerto 3000, en la misma computadora
// donde se abrio esta pagina. Esto hace que funcione tanto en
// localhost (desarrollo) como desde el celular de un mesero conectado
// a la red local (ej. http://192.168.1.50:4300 -> backend en
// http://192.168.1.50:3000).
export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;
