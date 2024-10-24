import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        clearMocks: true,
        environment: "node",
        globals: true,
        setupFiles: "./vitest.setup.ts",

    },
    define: {
        "process.env.PORT": 4000
    },
})