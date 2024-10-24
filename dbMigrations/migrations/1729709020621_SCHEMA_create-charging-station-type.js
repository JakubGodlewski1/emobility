exports.up = (pgm) => {
    pgm.sql(`
        CREATE TYPE current_type AS ENUM ('AC', 'DC');

        CREATE TABLE charging_station_type(
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(40) NOT NULL,
            plug_count INTEGER NOT NULL,
            efficiency DOUBLE PRECISION NOT NULL,
            current_type current_type NOT NULL,
            UNIQUE(id, name)
        );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
        DROP TABLE charging_station_type;
        DROP TYPE current_type;
    `)
};