exports.up = (pgm) => {
    pgm.sql(`
        CREATE TABLE charging_station(
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(40) NOT NULL,
            device_id UUID NOT NULL UNIQUE,
            ip_address INET NOT NULL UNIQUE,
            firmware_version VARCHAR(40) NOT NULL,
            charging_station_type_id UUID REFERENCES charging_station_type(id) ON DELETE RESTRICT
        );
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
        DROP TABLE charging_station;
    `)
};
