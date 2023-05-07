import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./test/setup.ts",
	},
});
