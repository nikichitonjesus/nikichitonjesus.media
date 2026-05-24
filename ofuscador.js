const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

console.log("Iniciando proceso de construcción...");

// 1. Procesar y Ofuscar episodios.js
try {
    // Lee el código limpio desde src/
    const codigoLimpio = fs.readFileSync('./lib/episodios.js', 'utf8');
    
    // Lo ofusca generando el código muerto y haciéndolo ilegible
    const resultado = JavaScriptObfuscator.obfuscate(codigoLimpio, {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        stringArrayEncoding: ['base64']
    });

    // Crea (o sobreescribe) el episodios.js ofuscado en la RAÍZ
    fs.writeFileSync('./episodios.js', resultado.getObfuscatedCode());
    console.log("✅ episodios.js ofuscado y guardado en la raíz.");

} catch (error) {
    console.error("❌ Error al procesar episodios.js:", error.message);
}

// 2. Procesar el index.html
try {
    // El HTML no se ofusca como el JS, así que solo lo copiamos de src/ a la raíz
    fs.copyFileSync('./src/index.html', './index.html');
    console.log("✅ index.html copiado a la raíz.");

} catch (error) {
    console.error("❌ Error al copiar index.html:", error.message);
}

console.log("¡Proceso terminado exitosamente!");
