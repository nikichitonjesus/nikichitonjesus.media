// subir.js
export function render(container) {
    let html = `
        <div class="max-w-5xl mx-auto py-8">
            <h1 class="text-4xl font-bold mb-8">Subir contenido</h1>
            
            <div class="bg-white/5 rounded-2xl p-6 md:p-8">
            
                </div>

                <!-- JotForm Embed (Iframe recomendado) -->
                <iframe
                    id="JotFormIFrame-261315880516053"
                    title="BM cooperantes"
                    onload="window.parent.scrollTo(0,0)"
                    allowtransparency="true"
                    allow="geolocation; microphone; camera; fullscreen; payment"
                    src="https://form.jotform.com/261315880516053"
                    frameborder="0"
                    style="min-width:100%; max-width:100%; height:700px; border:none;"
                    scrolling="no">
                </iframe>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Cargar el handler de JotForm (necesario para que funcione correctamente el embed)
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    document.body.appendChild(script);

    // Inicializar el handler
    script.onload = () => {
        if (window.jotformEmbedHandler) {
            window.jotformEmbedHandler(
                "iframe[id='JotFormIFrame-261315880516053']", 
                "https://form.jotform.com/"
            );
        }
    };
}

export const header = true;
