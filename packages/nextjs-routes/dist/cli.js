#!/usr/bin/env node
import { existsSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { generateNextJSRoutes } from "./core.js";
/**
 * CLI entry point for generating Next.js route types
 */
async function cli() {
    const dir = cwd();
    console.log("🔍 Scanning for Next.js routes...\n");
    // Check if we're in a Next.js project
    const hasAppDir = existsSync(join(dir, "app")) || existsSync(join(dir, "src", "app"));
    const hasPagesDir = existsSync(join(dir, "pages")) || existsSync(join(dir, "src", "pages"));
    if (!hasAppDir && !hasPagesDir) {
        console.error("❌ Error: Could not find 'app' or 'pages' directory in the current directory.");
        console.error(`   Expected to find either in: ${dir}\n`);
        console.error("   Make sure you're running this command in a Next.js project root.");
        process.exit(1);
    }
    try {
        const result = generateNextJSRoutes({ dir });
        console.log("✅ Route scanning complete!\n");
        console.log(`📊 Statistics:`);
        console.log(`   - Total routes found: ${result.routesFound}`);
        console.log(`   - Static routes: ${result.staticCount}`);
        console.log(`   - Dynamic routes: ${result.dynamicCount}\n`);
        console.log(`📝 Type declarations generated:`);
        console.log(`   ${result.outputPath}\n`);
    }
    catch (error) {
        console.error("❌ Error generating route types:");
        console.error(error);
        process.exit(1);
    }
}
// Run CLI
cli().catch((error) => {
    console.error("❌ Unexpected error:");
    console.error(error);
    process.exit(1);
});
