# SmarTransfer

Plataforma de transporte de carga para conectar solicitudes, transportistas, ofertas y seguimiento de viajes.

## Ejecutar

Desde esta carpeta, inicia un servidor estático:

```powershell
python -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. La página debe servirse por HTTP para que se carguen correctamente sus hojas de estilo y módulos.

## Organización

- `index.html`: estructura de la página y orden de carga.
- `assets/smartransfer-logo.png`: logotipo de SmarTransfer.
- `styles/`: estilos base y tema visual.
- `src/data/`: usuarios, recursos y datos iniciales.
- `src/core/`: estado, almacenamiento local, formato, utilidades, notificaciones e interfaz compartida.
- `src/features/`: autenticación, cargas, ofertas, disponibilidad, viajes, pagos, operaciones y perfil.
- `src/app.js`: navegación, renderizado y conexión de formularios.
- `src/boot.js`: sincronización entre pestañas e inicio.

La información se guarda en el almacenamiento local del navegador.
