const supabase = require('../config/db');

/**
 * GET /api/merch
 * Returns latest merchandise items.
 */
exports.getMerch = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        let query = supabase
            .from('merch')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(parseInt(limit));

        const { data, error } = await query;

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching merch:', error.message);
        res.status(500).json({ error: 'Failed to fetch merch' });
    }
};

/**
 * POST /api/merch
 * Adds a new merchandise item.
 */
exports.addMerch = async (req, res) => {
    try {
        const { title, price, image_url, status } = req.body;
        
        if (!title || !price || !image_url || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('merch')
            .insert([{ title, price, image_url, status }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error adding merch:', error.message);
        res.status(500).json({ error: 'Failed to add merch' });
    }
};
