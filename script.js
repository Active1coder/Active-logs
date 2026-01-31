document.addEventListener('DOMContentLoaded', () => {
    const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY'); // Replace with your Stripe publishable key
    const buyButton = document.getElementById('buy-button');
    const paymentStatus = document.getElementById('payment-status');

    buyButton.addEventListener('click', async () => {
        try {
            // Request a payment intent from your backend
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 1000 }) // Amount in cents ($10)
            });
            const { clientSecret } = await response.json();

            // Confirm the payment with Stripe Elements
            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: { // In a real app, use Stripe Elements to collect card details securely
                        number: '4242424242424242', // Test card
                        exp_month: 12,
                        exp_year: 2030,
                        cvc: '123'
                    }
                }
            });

            if (error) {
                paymentStatus.textContent = `Payment failed: ${error.message}`;
                paymentStatus.style.color = 'red';
            } else {
                paymentStatus.textContent = 'Payment successful!';
            }
        } catch (err) {
            paymentStatus.textContent = 'Error: ' + err.message;
            paymentStatus.style.color = 'red';
        }
    });
});
