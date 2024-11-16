// Clase principal para manejar la funcionalidad de la tienda
class ShopManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.initCategoryFilter();
        this.initQuantityValidation();
        this.initAnimations();
    }

    // Filtrado por categoría mejorado
    initCategoryFilter() {
        const categoriaSelect = document.getElementById('categoriaFiltro');
        if (categoriaSelect) {
            categoriaSelect.addEventListener('change', () => {
                const categoria = categoriaSelect.value;
                const url = new URL(window.location);
                
                if (categoria) {
                    url.searchParams.set('categoria', categoria);
                } else {
                    url.searchParams.delete('categoria');
                }
                
                window.location.href = url.toString();
            });
        }
    }

    // Validación de cantidad mejorada
    initQuantityValidation() {
        document.querySelectorAll('.add-to-cart-form').forEach(form => {
            const input = form.querySelector('input[name="cantidad"]');
            if (!input) return;

            const max = parseInt(input.getAttribute('max'));

            // Validación en tiempo real
            input.addEventListener('input', () => {
                const value = parseInt(input.value);
                if (value > max) {
                    input.value = max;
                    this.showToast(`Solo hay ${max} unidades disponibles`);
                } else if (value < 1) {
                    input.value = 1;
                }
            });

            // Validación al enviar
            form.addEventListener('submit', (e) => {
                const value = parseInt(input.value);
                if (value > max || value < 1) {
                    e.preventDefault();
                    this.showToast('Por favor, ingrese una cantidad válida');
                    input.value = value > max ? max : 1;
                }
            });
        });
    }

    // Animaciones para mejorar UX
    initAnimations() {
        // Animación al cargar productos
        const productos = document.querySelectorAll('.product-card');
        productos.forEach((producto, index) => {
            producto.style.opacity = '0';
            producto.style.transform = 'translateY(20px)';
            setTimeout(() => {
                producto.style.transition = 'all 0.3s ease';
                producto.style.opacity = '1';
                producto.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animación para badges de stock
        const badges = document.querySelectorAll('.badge-stock');
        badges.forEach(badge => {
            badge.classList.add('animate__animated', 'animate__fadeIn');
        });
    }

    // Sistema de notificaciones mejorado
    showToast(message, type = 'info') {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';

        const bgColor = type === 'error' ? 'bg-danger' : 
                       type === 'success' ? 'bg-success' : 
                       'bg-primary';

        toastContainer.innerHTML = `
            <div class="toast ${bgColor} text-white" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong class="me-auto">Notificación</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        document.body.appendChild(toastContainer);
        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'), {
            autohide: true,
            delay: 3000
        });
        toast.show();

        // Limpiar el DOM después de que el toast se oculte
        setTimeout(() => {
            toastContainer.remove();
        }, 3500);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ShopManager();
});
