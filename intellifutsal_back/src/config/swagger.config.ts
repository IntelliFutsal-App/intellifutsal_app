import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";


const DEV_BASE_URL = process.env.SWAGGER_DEV_URL ?? "http://localhost:3001/api/v1";
const PROD_BASE_URL = process.env.SWAGGER_PROD_URL ?? "https://intellifutsal.duckdns.org/api/v1";

const servers = [
    { url: DEV_BASE_URL, description: "Servidor de desarrollo" },
    { url: PROD_BASE_URL, description: "Servidor de producción" },
].filter(Boolean);

const DESCRIPTION = [
    "API para la gestión y análisis de rendimiento en fútbol sala con IA.",
    "",
    "### Módulos",
    "- **Auth** (público): registro, login, validación de token.",
    "- **AI**: predicciones, análisis y recomendaciones a nivel jugador y equipo.",
    "- **Core**: Users, Players, Coaches, Teams, y relaciones (PlayerTeams, CoachTeams, PlayerClusters, Clusters).",
    "",
    "**Nota:** Los endpoints protegidos usan **JWT Bearer**. Los endpoints de **Auth** son **públicos**."
].join("\n");

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "IntelliFutsal API",
            version: "1.0.0",
            description: DESCRIPTION,
            contact: {
                name: "Equipo de Desarrollo",
                email: "jsdosman0@gmail.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            }
        },
        externalDocs: {
            description: "README del proyecto",
            url: "https://github.com/SebasDosman/intellifutsal_app",
        },
        servers,
        components: {
            securitySchemes: {
                bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description:
                    "Ingrese el token JWT obtenido en /api/auth/login o /api/auth/register.\nFormato: **Bearer &lt;token&gt;**",
                },
            },
        },

        tags: [
            { name: "AI Predictions", description: "Predicciones individuales de jugadores" },
            { name: "AI Analysis", description: "Análisis detallado de rendimiento" },
            { name: "AI Recommendations", description: "Recomendaciones completas por jugador" },
            { name: "AI Team Predictions", description: "Predicciones a nivel de equipo" },
            { name: "AI Team Analysis", description: "Análisis completos de equipos" },

            { name: "Auth", description: "Registro, login y validación de token (público)" },
            { name: "Users", description: "Gestión de credenciales/usuarios" },
            { name: "Players", description: "Gestión de jugadores" },
            { name: "Coaches", description: "Gestión de entrenadores" },
            { name: "Teams", description: "Gestión de equipos" },
            { name: "Clusters", description: "Gestión de clusters de IA" },
            { name: "PlayerClusters", description: "Asignaciones de clusters a jugadores" },
            { name: "PlayerTeams", description: "Asignaciones jugador–equipo" },
            { name: "CoachTeams", description: "Asignaciones coach–equipo" },
        ],

        "x-tagGroups": [
            {
                name: "Inteligencia Artificial",
                tags: [
                    "AI Predictions",
                    "AI Analysis",
                    "AI Recommendations",
                    "AI Team Predictions",
                    "AI Team Analysis",
                ],
            },
            {
                name: "Autenticación",
                tags: ["Auth"],
            },
            {
                name: "Recursos del Sistema",
                tags: [
                    "Users",
                    "Players",
                    "Coaches",
                    "Teams",
                    "Clusters",
                    "PlayerClusters",
                    "PlayerTeams",
                    "CoachTeams",
                ],
            },
        ],
    },

    apis: [
        "./src/routes/**/*.ts",
        "./src/controllers/**/*.ts",
        "./src/docs/**/*.ts",
    ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, {
            explorer: true,
            customSiteTitle: "IntelliFutsal API Docs",
            customfavIcon:
                "https://intellifutsalstorage.blob.core.windows.net/intellifutsal-files/icon.png",
            customCss: `
                .swagger-ui .topbar { background: #111827; } /* si quieres barra oscura */
                .swagger-ui .topbar .link span { color: #fff !important; }
                .swagger-ui .scheme-container { background: #f9fafb; } /* gris suave */
            `,
            customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
            customJs: [
                "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
                "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
            ],
            swaggerOptions: {
                persistAuthorization: true, 
                displayRequestDuration: true,
                filter: true, 
                showExtensions: true,
                showCommonExtensions: true,
                docExpansion: "none", 
                defaultModelsExpandDepth: -1, 
                defaultModelExpandDepth: 2,
                tryItOutEnabled: true,
                tagsSorter: "alpha",
                operationsSorter: "alpha",
                layout: "StandaloneLayout",
            },
        })
    );

    app.get("/api-docs.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(specs);
    });
};

export { specs };