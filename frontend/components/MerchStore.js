/**
 * MerchStore Component
 * Handles the rendering of merchandise and the PayHero payment integration.
 */

export class MerchStore {
    constructor(containerId, merch = []) {
        this.container = document.getElementById(containerId);
        this.merch = merch;
        this.modal = document.getElementById('checkout-modal');
        this.form = document.getElementById('checkout-form');
        this.selectedItem = null;
        
        this.init();
    }

    init() {
        if (this.modal) {
            const closeBtn = document.getElementById('close-checkout');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }

            window.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handlePayment(e));
        }
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = this.merch.map(m => `
            <div class="merch-card" data-id="${m.id}">
                <div class="merch-badge">${m.status.replace('-', ' ').toUpperCase()}</div>
                <div class="merch-img-container">
                    <img src="${m.image_url || m.imageUrl}" alt="${m.title}" loading="lazy">
                </div>
                <div class="merch-details">
                    <h3 class="merch-title">${m.title}</h3>
                    <div class="merch-price">${m.price}</div>
                    <button class="btn btn-outline buy-now-btn" style="width: 100%;" 
                        data-id="${m.id}" 
                        data-title="${m.title}" 
                        data-price="${m.price}">
                        Pre-Order / View
                    </button>
                </div>
            </div>
        `).join('');

        // Link events
        this.container.querySelectorAll('.buy-now-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = {
                    id: btn.dataset.id,
                    title: btn.dataset.title,
                    price: btn.dataset.price
                };
                this.openCheckout(item);
            });
        });
    }

    openCheckout(item) {
        this.selectedItem = item;
        document.getElementById('checkout-item-name').textContent = item.title;
        document.getElementById('checkout-total').textContent = item.price;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
        const status = document.getElementById('payment-status');
        status.textContent = '';
        status.className = 'payment-status';
        const payBtn = document.getElementById('pay-btn');
        payBtn.disabled = false;
        payBtn.textContent = 'Confirm & Pay';
    }

    async handlePayment(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const fanData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            item: this.selectedItem.title,
            amount: parseInt(this.selectedItem.price.replace(/[^0-9]/g, ''))
        };

        const status = document.getElementById('payment-status');
        const payBtn = document.getElementById('pay-btn');

        status.textContent = 'Initiating M-Pesa prompt...';
        status.className = 'payment-status processing';
        payBtn.disabled = true;

        try {
            const response = await fetch('/api/payments/payhero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fanData)
            });

            const result = await response.json();

            if (response.ok) {
                status.textContent = 'Please check your phone for the M-Pesa prompt!';
                status.className = 'payment-status success';
                
                // Here you would normally poll for status
                // For now we'll just show success of initiation
            } else {
                throw new Error(result.message || 'Payment initiation failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            status.textContent = 'Error: ' + error.message;
            status.className = 'payment-status error';
            payBtn.disabled = false;
        }
    }
}
