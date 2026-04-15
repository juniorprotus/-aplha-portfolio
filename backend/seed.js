require('dotenv').config();
const supabase = require('./config/db');

const initialVideos = [
    { title: 'Pod Aheri [i still love you]', youtube_url: 'https://www.youtube.com/embed/74Ouxp-kBNk', thumbnail_url: 'https://img.youtube.com/vi/74Ouxp-kBNk/mqdefault.jpg', category: 'music-video' },
    { title: 'Kumkum bhagya', youtube_url: 'https://www.youtube.com/embed/sjc23LEH2pc', thumbnail_url: 'https://img.youtube.com/vi/sjc23LEH2pc/mqdefault.jpg', category: 'music-video' },
    { title: 'Milele ft Denzel carntana', youtube_url: 'https://www.youtube.com/embed/yEojRnPdnO4', thumbnail_url: 'https://img.youtube.com/vi/yEojRnPdnO4/mqdefault.jpg', category: 'music-video' },
    { title: 'Addicted ft Madstrit', youtube_url: 'https://www.youtube.com/embed/2fbuOJKQyuM', thumbnail_url: 'https://img.youtube.com/vi/2fbuOJKQyuM/mqdefault.jpg', category: 'music-video' },
    { title: 'Whine ft Madstrit', youtube_url: 'https://www.youtube.com/embed/9dlQZ0c_QeE', thumbnail_url: 'https://img.youtube.com/vi/9dlQZ0c_QeE/mqdefault.jpg', category: 'music-video' },
    { title: 'Levels ft Madstrit', youtube_url: 'https://www.youtube.com/embed/YRrbQZpQdsQ', thumbnail_url: 'https://img.youtube.com/vi/YRrbQZpQdsQ/mqdefault.jpg', category: 'music-video' },
    { title: 'Freestyle on @Raptures song', youtube_url: 'https://www.youtube.com/embed/lEa7BcT3Yqo', thumbnail_url: 'https://img.youtube.com/vi/lEa7BcT3Yqo/mqdefault.jpg', category: 'freestyle' }
];

const initialSongs = [
    { title: 'Pod Aheri [i still love you]', youtube_url: '74Ouxp-kBNk', thumbnail_url: 'https://img.youtube.com/vi/74Ouxp-kBNk/mqdefault.jpg', category: 'single' },
    { title: 'Kumkum bhagya', youtube_url: 'sjc23LEH2pc', thumbnail_url: 'https://img.youtube.com/vi/sjc23LEH2pc/mqdefault.jpg', category: 'single' },
    { title: 'Milele', youtube_url: 'yEojRnPdnO4', thumbnail_url: 'https://img.youtube.com/vi/yEojRnPdnO4/mqdefault.jpg', category: 'single' },
    { title: 'Addicted', youtube_url: '2fbuOJKQyuM', thumbnail_url: 'https://img.youtube.com/vi/2fbuOJKQyuM/mqdefault.jpg', category: 'single' },
    { title: 'Whine', youtube_url: '9dlQZ0c_QeE', thumbnail_url: 'https://img.youtube.com/vi/9dlQZ0c_QeE/mqdefault.jpg', category: 'single' },
    { title: 'Levels', youtube_url: 'YRrbQZpQdsQ', thumbnail_url: 'https://img.youtube.com/vi/YRrbQZpQdsQ/mqdefault.jpg', category: 'single' },
    { title: 'Baby Fever', youtube_url: '4HkMCBYDXuU', thumbnail_url: 'https://img.youtube.com/vi/4HkMCBYDXuU/mqdefault.jpg', category: 'single' },
    { title: 'Freestyle on @Raptures song', youtube_url: 'lEa7BcT3Yqo', thumbnail_url: 'https://img.youtube.com/vi/lEa7BcT3Yqo/mqdefault.jpg', category: 'freestyle' }
];

async function seed() {
    console.log('🌱 Starting database seeding...');

    try {
        // Seed Videos
        const { error: vError } = await supabase.from('videos').insert(initialVideos);
        if (vError) throw vError;
        console.log('✅ Videos seeded successfully.');

        // Seed Songs
        const { error: sError } = await supabase.from('songs').insert(initialSongs);
        if (sError) throw sError;
        console.log('✅ Songs seeded successfully.');

        console.log('✨ Seeding complete!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        console.log('\nNOTE: If you havent run the schema.sql in Supabase yet, this script will fail. Please run the SQL first!');
    }
}

seed();
