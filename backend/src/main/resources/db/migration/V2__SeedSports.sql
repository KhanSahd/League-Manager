ALTER TABLE sport ADD CONSTRAINT uk_sport_name UNIQUE (name);

INSERT INTO sport (id, name) VALUES
    (gen_random_uuid(), 'Basketball'),
    (gen_random_uuid(), 'Soccer'),
    (gen_random_uuid(), 'Baseball'),
    (gen_random_uuid(), 'Football'),
    (gen_random_uuid(), 'Tennis'),
    (gen_random_uuid(), 'Esports')
ON CONFLICT (name) DO NOTHING;
