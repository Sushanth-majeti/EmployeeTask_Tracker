/*
  # Team Dashboard Schema

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `created_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `status` (text: pending, in_progress, completed, overdue)
      - `priority` (text: low, medium, high)
      - `due_date` (date)
      - `assigned_to` (uuid, foreign key to team_members)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read data
    - Add policies for authenticated users to manage tasks
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  due_date date NOT NULL,
  assigned_to uuid REFERENCES team_members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to team_members"
  ON team_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to tasks"
  ON tasks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to tasks"
  ON tasks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to tasks"
  ON tasks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to tasks"
  ON tasks FOR DELETE
  TO public
  USING (true);

INSERT INTO team_members (name, role) VALUES
  ('Alice Johnson', 'Frontend Developer'),
  ('Bob Smith', 'Backend Developer'),
  ('Carol Williams', 'UI/UX Designer'),
  ('David Brown', 'DevOps Engineer'),
  ('Emma Davis', 'QA Engineer'),
  ('Michael Chen', 'Full Stack Developer'),
  ('Sarah Kim', 'Product Manager'),
  ('James Wilson', 'Data Analyst'),
  ('Olivia Martinez', 'Marketing Specialist'),
  ('Daniel Taylor', 'Customer Support Lead');

INSERT INTO tasks (title, status, priority, due_date, assigned_to) VALUES
  ('Fix responsive layout bugs', 'pending', 'medium', '2024-12-10', (SELECT id FROM team_members WHERE name = 'Alice Johnson')),
  ('Implement dashboard UI', 'in_progress', 'high', '2024-12-05', (SELECT id FROM team_members WHERE name = 'Alice Johnson')),
  ('Build login page', 'completed', 'high', '2024-11-25', (SELECT id FROM team_members WHERE name = 'Alice Johnson')),
  ('Database optimization', 'pending', 'medium', '2024-12-15', (SELECT id FROM team_members WHERE name = 'Bob Smith')),
  ('API integration', 'in_progress', 'high', '2024-12-08', (SELECT id FROM team_members WHERE name = 'Bob Smith'));
