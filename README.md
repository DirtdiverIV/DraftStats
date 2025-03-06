# Estadísticas de Béisbol - Visualizador de Datos

![Logo-Béisbol](https://img.shields.io/badge/Baseball-Stats-blue)

Una aplicación web que permite visualizar y filtrar estadísticas de béisbol con opciones avanzadas de filtrado para bateadores y pitchers. Desarrollada con React y AG Grid.


## 🚀 Características

- **Visualización de datos de bateadores y pitchers** con estadísticas completas
- **Filtros avanzados** para cada columna (mayor que, menor que, entre, etc.)
- **Diseño oscuro** con tema Quartz para una mejor experiencia
- **Interfaz compacta** que maximiza el espacio en pantalla
- **Selector de número de resultados** por página
- **Exportación a CSV** de datos filtrados
- **Carga automática** de archivos CSV
- **Diseño responsive** para diferentes dispositivos

## 🛠️ Tecnologías

- React.js
- AG Grid Enterprise
- PapaParse (para procesamiento de CSV)
- Bootstrap (estilos básicos)
- GitHub Pages (despliegue)

## 📋 Requisitos

- Node.js (v14 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/DirtdiverIV/DraftStats.git
cd DraftStats/estadisticas-beisbol
```

2. **Instalar dependencias**:
```bash
npm install --legacy-peer-deps
```

3. **Ejecutar en modo desarrollo**:
```bash
npm start
```

## 📊 Estructura de datos

La aplicación utiliza dos conjuntos de datos:

### Bateadores
Columnas principales:
- Rank, Name, Team, G, PA, AB, H, 2B, 3B, HR, R, RBI, BB, SO, HBP, SB, CS
- Estadísticas avanzadas: BB%, K%, ISO, BABIP, AVG, OBP, SLG, OPS, wOBA, wRC+, ADP

### Pitchers
Columnas principales:
- Rank, Name, Team, GS, G, IP, W, L, QS, SV, HLD, H, ER, HR, SO, BB
- Estadísticas avanzadas: K/9, BB/9, K/BB, HR/9, AVG, WHIP, BABIP, LOB%, ERA, FIP, ADP

## 🖥️ Uso

1. Selecciona entre "Bateadores" o "Pitchers" usando las pestañas
2. Utiliza los filtros haciendo clic en los encabezados de columna
3. Ajusta el número de resultados por página con el selector
4. Exporta los datos filtrados con el botón "Exportar"
5. Limpia todos los filtros con el botón "Limpiar"

## 📦 Despliegue

Para desplegar en GitHub Pages:

```bash
npm run deploy
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Haz fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**DirtdiverIV**

- GitHub: [@DirtdiverIV](https://github.com/DirtdiverIV)

---

Hecho con ❤️ para los amantes del béisbol y las estadísticas
