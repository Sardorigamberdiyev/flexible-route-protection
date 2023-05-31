
create TABLE person(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    phone VARCHAR(30) UNIQUE,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    is_baned BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false
);

create TABLE role(
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100),
    description VARCHAR(255)
);

create TABLE role_person(
    id SERIAL PRIMARY KEY,
    role_id INTEGER,
    person_id INTEGER,
    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(person_id) REFERENCES person(id)
);

create TABLE permission(
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100),
    description VARCHAR(255)
);

create TABLE role_permission(
    id SERIAL PRIMARY KEY,
    role_id INTEGER,
    permission_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (permission_id) REFERENCES permission (id)
);

create TABLE country(
    id SERIAL PRIMARY KEY,
    name_ru VARCHAR(255),
    name_uz VARCHAR(255),
    name_oz VARCHAR(255)
);