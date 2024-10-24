exports.up = (pgm) => {
    pgm.sql(`
       CREATE UNIQUE INDEX unique_priority_connector
        ON connector (charging_station_id)
        WHERE priority = true;
    `);
};


exports.down = (pgm) => {
    pgm.sql(`
        DROP INDEX unique_priority_connector;
    `)
};
