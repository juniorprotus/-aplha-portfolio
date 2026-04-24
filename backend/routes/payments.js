const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// PayHero Credentials from Environment Variables
const PAYHERO_USERNAME = process.env.PAYHERO_USERNAME;
const PAYHERO_PASSWORD = process.env.PAYHERO_PASSWORD;
const PAYHERO_CHANNEL_ID = process.env.PAYHERO_CHANNEL_ID;

/**
 * @route   POST /api/payments/payhero
 * @desc    Initiate PayHero M-Pesa STK Push
 */
router.post('/payhero', async (req, res) => {
    const { name, phone, amount, item, location } = req.body;

    if (!phone || !amount) {
        return res.status(400).json({ message: 'Phone and Amount are required' });
    }

    // Format phone number to 254...
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
        formattedPhone = '254' + formattedPhone;
    }

    try {
        // 1. Prepare PayHero API Request
        const auth = Buffer.from(`${PAYHERO_USERNAME}:${PAYHERO_PASSWORD}`).toString('base64');
        
        const payheroRequest = {
            amount: amount,
            phone_number: formattedPhone,
            channel_id: parseInt(PAYHERO_CHANNEL_ID),
            external_reference: `ORDER-${Date.now()}`,
            callback_url: `https://${req.get('host')}/api/payments/callback`
        };

        const response = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify(payheroRequest)
        });

        const data = await response.json();

        if (response.ok) {
            // 2. Log Payment Attempt to Supabase
            await supabase.from('orders').insert([{
                fan_name: name,
                phone: formattedPhone,
                amount: amount,
                item: item,
                location: location,
                reference: payheroRequest.external_reference,
                status: 'pending'
            }]);

            res.status(200).json({ 
                success: true, 
                message: 'STK Push Initiated',
                reference: payheroRequest.external_reference 
            });
        } else {
            console.error('PayHero API Error:', data);
            res.status(500).json({ message: 'Failed to initiate payment', details: data });
        }
    } catch (error) {
        console.error('Server error during payment:', error);
        res.status(500).json({ message: 'Server error processing payment' });
    }
});

/**
 * @route   POST /api/payments/callback
 * @desc    Receive payment status from PayHero
 */
router.post('/callback', async (req, res) => {
    const payload = req.body;
    console.log('Payment Callback Received:', payload);

    try {
        const { external_reference, status, checkout_request_id } = payload;
        
        // Update order status in Supabase
        await supabase
            .from('orders')
            .update({ 
                status: status === 'Success' ? 'paid' : 'failed',
                transaction_id: checkout_request_id 
            })
            .match({ reference: external_reference });

        res.status(200).send('OK');
    } catch (error) {
        console.error('Callback processing error:', error);
        res.status(500).send('Error');
    }
});

module.exports = router;
