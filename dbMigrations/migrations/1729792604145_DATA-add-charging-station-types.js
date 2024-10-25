exports.up = (pgm) => {
    pgm.sql(`
    INSERT INTO charging_station_type (name, plug_count, efficiency, current_type) VALUES
    ('Standard AC Charger', 4, 2.2, 'AC'),
    ('Fast DC Charger', 3, 5.0, 'DC'),
    ('Ultra Fast DC Charger', 3, 1.5, 'DC'),
    ('Level 2 AC Charger', 2, 2.2, 'AC'),
    ('Home AC Charger', 2, 3.8, 'AC');
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
        DELETE FROM charging_station_type;
    `)
};
