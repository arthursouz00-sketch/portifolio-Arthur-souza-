document.addEventListener('DOMContentLoaded', function () {
    const anoAtual = document.getElementById('ano-atual');
    const barraProgresso = document.getElementById('barra-progresso');
    const menuLinks = Array.from(document.querySelectorAll('.menu-link[href^="#"]'));
    const secoes = Array.from(document.querySelectorAll('main section[id]'));
    const elementosRevelar = document.querySelectorAll(
        '.cabecalho-texto, .cabecalho-foto, .sobre-grade > *, .projetos-cabecalho, .projetos-card, .contatos-conteudo'
    );

    if (anoAtual) anoAtual.textContent = new Date().getFullYear();

    elementosRevelar.forEach(function (elemento, indice) {
        elemento.classList.add('revelar');
        elemento.style.transitionDelay = `${Math.min(indice % 4 * 80, 240)}ms`;
    });

    if ('IntersectionObserver' in window) {
        const observadorRevelacao = new IntersectionObserver(function (entradas, observador) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visivel');
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12 });

        elementosRevelar.forEach(function (elemento) {
            observadorRevelacao.observe(elemento);
        });

        const observadorSecoes = new IntersectionObserver(function (entradas) {
            const entradaAtiva = entradas
                .filter(function (entrada) { return entrada.isIntersecting; })
                .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];

            if (!entradaAtiva) return;

            menuLinks.forEach(function (link) {
                link.classList.toggle('ativo', link.getAttribute('href') === `#${entradaAtiva.target.id}`);
            });
        }, { rootMargin: '-20% 0px -65%', threshold: [0.05, 0.2, 0.5] });

        secoes.forEach(function (secao) {
            observadorSecoes.observe(secao);
        });
    } else {
        elementosRevelar.forEach(function (elemento) {
            elemento.classList.add('visivel');
        });
    }

    function atualizarProgresso() {
        if (!barraProgresso) return;
        const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;
        const progresso = alturaRolavel > 0 ? (window.scrollY / alturaRolavel) * 100 : 0;
        barraProgresso.style.width = `${Math.min(progresso, 100)}%`;
    }

    window.addEventListener('scroll', atualizarProgresso, { passive: true });
    atualizarProgresso();

    if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
        document.querySelectorAll('.projetos-card').forEach(function (card) {
            card.addEventListener('pointermove', function (evento) {
                const limites = card.getBoundingClientRect();
                if (!limites) return;

                const x = (evento.clientX - limites.left) / limites.width - 0.5;
                const y = (evento.clientY - limites.top) / limites.height - 0.5;
                card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg)`;
            });

            card.addEventListener('pointerleave', function () {
                card.style.transform = '';
            });
        });
    }
});

