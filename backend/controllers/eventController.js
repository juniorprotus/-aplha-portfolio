const supabase = require('../config/db');

/**
 * GET /api/events
 * Returns latest events (Tours/Gigs).
 */
exports.getEvents = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        let query = supabase
            .from('events')
            .select('*')
            .order('date', { ascending: false })
            .limit(parseInt(limit));

        const { data, error } = await query;

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

/**
 * POST /api/events
 * Adds a new event.
 */
exports.addEvent = async (req, res) => {
    try {
        const { title, date, venue, location, status, ticket_link } = req.body;
        
        if (!title || !date || !venue || !location || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('events')
            .insert([{ title, date, venue, location, status, ticket_link }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error adding event:', error.message);
        res.status(500).json({ error: 'Failed to add event' });
    }
};
