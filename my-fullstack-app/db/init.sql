-- SQL commands to initialize the PostgreSQL database

-- Create a table for tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data into the tasks table
INSERT INTO tasks (title, description) VALUES
('Sample Task 1', 'This is a description for sample task 1.'),
('Sample Task 2', 'This is a description for sample task 2.');