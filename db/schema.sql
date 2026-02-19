-- Missing "REGION" table inferred from FK usage in other tables
-- Assuming generic INT for logical foreign keys where parent table is missing

CREATE TABLE pickup_time (
    time_id SERIAL PRIMARY KEY,
    region_id INT NOT NULL, -- Marked as FK in diagram, but table is missing
    available_times VARCHAR(255)
);

CREATE TABLE user_account (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Ensure you store hashes, not plaintext
    pickup_or_dropoff VARCHAR(50),
    address TEXT,
    region_id INT -- Marked as FK in diagram
);

CREATE TABLE rebate (
    rebate_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    compost_weight FLOAT,
    rebate_amount FLOAT, -- See note below regarding money types
    CONSTRAINT fk_account
        FOREIGN KEY (account_id)
        REFERENCES user_account(user_id)
);

CREATE TABLE compost_truck_driver (
    employee_id SERIAL PRIMARY KEY,
    route_id VARCHAR(50),
    route_time VARCHAR(100)
);

CREATE TABLE dropoff_location (
    location_id SERIAL PRIMARY KEY,
    address TEXT,
    route_time VARCHAR(100)
);
