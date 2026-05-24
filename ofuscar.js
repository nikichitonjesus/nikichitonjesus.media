const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

console.log("🚀 Iniciando la ofuscación para Vercel...");

// 1. Asegurar que la carpeta 'dist' exista en el servidor de Vercel
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

try {
    // 2. Leer tu JS limpio desde src/
    const codigoLimpio = fs.readFileSync('./src/episodios.js', 'utf8');
    
    // 3. Ofuscar el código (añadiendo el código muerto y base64)
    const resultado = JavaScriptObfuscator.obfuscate(codigoLimpio, {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        stringArray: true,
        stringArrayEncoding: ['base64']
    });

    // 4. Guardar el JS ofuscado dentro de la carpeta dist/
    fs.writeFileSync('./dist/episodios.js', resultado.getObfuscatedCode());
    console.log("✅ JS ofuscado correctamente en dist/episodios.js");

} catch (error) {
    console.error("❌ Error al ofuscar el JS:", error.message);
}

try {
    // 5. Copiar tu HTML limpio a la carpeta dist/ para que acompañe al JS
    fs.copyFileSync('./src/index.html', './dist/index.html');
    console.log("✅ index.html copiado a la carpeta dist/");
} catch (error) {
    console.error("❌ Error al copiar el HTML:", error.message);
}

console.log("🎉 ¡Proceso de construcción terminado!");
