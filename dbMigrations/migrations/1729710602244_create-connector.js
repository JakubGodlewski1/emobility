exports.up = (pgm) => {
    pgm.sql(`
        CREATE TABLE connector(
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(40) NOT NULL,
            priority BOOLEAN NOT NULL DEFAULT false,
            charging_station_id UUID REFERENCES charging_station(id) ON DELETE SET NULL,
            UNIQUE (id, charging_station_id)
        );
    `);
};


exports.down = (pgm) => {
    pgm.sql(`
        DROP TABLE connector;
    `)
};
