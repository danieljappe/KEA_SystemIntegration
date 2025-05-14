document.querySelectorAll('button[data-price-id]').forEach(button => {
    button.addEventListener('click', async () => {
        const priceId = button.getAttribute('data-price-id');
        
        try {
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const { url } = await response.json();
            
            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your payment. Please try again.');
        }
    });
});