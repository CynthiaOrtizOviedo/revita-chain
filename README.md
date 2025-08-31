# Revita Chain

## Recuperación de Activos Digitales Descentralizada y Segura

**Revita Chain** es una solución innovadora diseñada para proteger tus activos digitales de pérdidas debido a claves olvidadas, dispositivos extraviados o situaciones imprevistas. Aprovechando el poder de las Smart Accounts, la biometría y una red de guardianes asignados por el usuario de confianza, Revita Chain ofrece un mecanismo de recuperación robusto, privado y fácil de usar.

--- 

## ✨ Características Principales

-   **Safe Smart Account con Módulo Interno**: Extiende la funcionalidad de las cuentas seguras existentes con nuestra lógica de recuperación personalizada, garantizando la máxima seguridad de los fondos.
-   **Recuperación con Privacidad (FHE-ready)**: Diseñado para futuras integraciones con Cifrado Homomórfico Completo (FHE) de Zama, permitiendo la verificación biométrica sin exponer datos sensibles.
-   **Guardianes Asignados por el Usuario Verificados por Farcaster**: Permite a los usuarios designar hasta dos guardianes de confianza, cuya identidad puede ser verificada a través de sus handles de Farcaster y attestations on-chain.
-   **Verificación de Identidad Biométrica (WebAuthn/Passkey)**: Utiliza la biometría (huella digital, reconocimiento facial) y passkeys para un acceso rápido y seguro, con un contador de intentos de acceso y almacenamiento de hashes biométricos en IPFS/Filecoin.
-   **Timers y Notificaciones Automatizadas (Chainlink)**: Implementa time-locks de inactividad y notificaciones programadas (ej. "faltan 24 hs para vencer tu timelock") utilizando Chainlink Keepers y Functions.
-   **Almacenamiento Descentralizado (IPFS/Filecoin)**: Almacena de forma segura y redundante los hashes biométricos y otros datos críticos para la recuperación.
-   **Modelo de Incentivos Transparente**: Una fee única del 0.5% se cobra automáticamente tras la tercera recuperación en un año, implementada como un "costo al vault" que se quema o redistribuye.
-   **UX Multilingüe y Accesible**: Interfaz de usuario intuitiva en Español, Inglés y Portugués, con soporte para Dark Mode, tipografía legible y diseño Mobile-First, cumpliendo con WCAG 2.1.
-   **Tutorial y Modo Práctica**: Un onboarding guiado y un modo de práctica para que los usuarios se familiaricen con el proceso de recuperación sin riesgo.

--- 

## 🏗️ Arquitectura del Proyecto

Revita Chain se compone de dos módulos principales:

1.  **Smart Contracts (Solidity)**:
    *   **RecoveryModule**: Un módulo interno para Safe Smart Accounts que gestiona la lógica de recuperación, guardianes, biometría y timelocks.
    *   Integración con Chainlink para automatización y notificaciones.
    *   Preparado para la verificación de guardianes vía attestations de Farcaster.
    *   Desplegado en **Base Sepolia** (para el hackathon).

2.  **Frontend (Next.js Mini App)**:
    *   Construido con **Next.js 14**, **Wagmi** y **RainbowKit** para una interacción fluida con la blockchain.
    *   Integración con la API WebAuthn del navegador para la gestión biométrica.
    *   Manejo de almacenamiento descentralizado con librerías para IPFS/Filecoin.
    *   Diseñado como una Mini App optimizada para el ecosistema **Base**.

--- 

## 🛠️ Stack Tecnológico

-   **Smart Contracts**: Solidity, Hardhat, OpenZeppelin, Safe Protocol Kit, Chainlink Contracts.
-   **Blockchain**: Base (Sepolia Testnet).
-   **Frontend**: Next.js 14, React, TypeScript, Wagmi, Viem, RainbowKit, Tailwind CSS.
-   **Biometría**: WebAuthn API.
-   **Almacenamiento Descentralizado**: IPFS, Filecoin.
-   **Automatización/Oráculos**: Chainlink Keepers, Chainlink Functions.
-   **Identidad Social**: Farcaster (integración conceptual/vía attestations).
-   **DevOps**: GitHub Actions (CI/CD), Jest (Testing), Docker (entorno de desarrollo).

--- 

## 🚀 Cómo Empezar (Para Desarrolladores)

Para poner en marcha Revita Chain en tu entorno local, sigue estos pasos:

### 1. Requisitos Previos

Asegúrate de tener instalados:
-   Git
-   Node.js (v18+) y npm
-   Python (v3.9+) y pip
-   Docker y Docker Compose
-   Visual Studio Code (recomendado)

### 2. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO_REVITA_CHAIN]
cd revita-chain
```

### 3. Configuración de Variables de Entorno

Copia el archivo `.env.example` y renómbralo a `.env` en la raíz del proyecto. Rellena las variables necesarias:

```bash
cp .env.example .env
```

Edita `.env` con tus claves privadas, API keys de Basescan y Project ID de WalletConnect.

### 4. Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
# Desplegar en Base Sepolia (asegúrate de tener fondos de prueba)
# npx hardhat run scripts/deploy.ts --network baseSepolia
# Ejecutar tests
npx hardhat test
```

### 5. Frontend

```bash
cd app
npm install
npm run build # Para construir la aplicación
npm run dev   # Para iniciar el servidor de desarrollo
# Ejecutar tests
npm test
```

Tu aplicación frontend estará disponible en `http://localhost:3000`.

--- 

## 🏆 Alineación con el Hackathon Aleph

Revita Chain está fuertemente alineado con varios tracks clave del Hackathon Aleph:

-   **Zama Track**: Integración futura de FHE para privacidad biométrica.
-   **Filecoin Track**: Uso de IPFS/Filecoin para almacenamiento descentralizado de datos críticos.
-   **Base Track**: Desarrollo como una Mini App optimizada para el ecosistema Base.
-   **Lisk Founder Track**: Construcción de una aplicación descentralizada que resuelve un problema real y tiene impacto en el mundo real.

--- 

## 🛣️ Próximos Pasos (Post-Hackathon)

-   Implementación completa de FHE (Zama) para verificación biométrica privada.
-   Integración robusta con Farcaster y Ethereum Attestation Service (EAS).
-   Sistema de notificaciones avanzado (Push Protocol, SendGrid).
-   Optimización de gas y escalabilidad.
-   Auditorías de seguridad y gobernanza descentralizada.

--- 

## 📄 Licencia

Este proyecto está bajo la licencia Apache 2.0 . Consulta el archivo `LICENSE` para más detalles.

--- 

**Desarrollado con pasión por CynthiaOrtizOviedo.**


