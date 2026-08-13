/*
# Create placement dashboard state

1. New Tables
- `placement_dashboard_state` stores the single shared demo dashboard's current academic year, department filter, and notification read count.
- `id` is a singleton text key.
- `academic_year` stores the selected academic year.
- `department` stores the selected department filter.
- `notifications_read` stores the number of notifications marked as read.
- `updated_at` records the latest preference change.

2. Security
- Row level security is enabled.
- This prototype has no sign-in screen, so the anonymous and authenticated roles can read and update the shared demo state.

3. Important Notes
- The table intentionally contains only non-sensitive presentation preferences for a single-tenant CEO demo.
- The singleton row is inserted only when it does not already exist.
*/

CREATE TABLE IF NOT EXISTS placement_dashboard_state (
  id text PRIMARY KEY DEFAULT 'demo',
  academic_year text NOT NULL DEFAULT '2025-26',
  department text NOT NULL DEFAULT 'All Departments',
  notifications_read integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE placement_dashboard_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo_state_select" ON placement_dashboard_state;
CREATE POLICY "demo_state_select" ON placement_dashboard_state
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "demo_state_insert" ON placement_dashboard_state;
CREATE POLICY "demo_state_insert" ON placement_dashboard_state
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "demo_state_update" ON placement_dashboard_state;
CREATE POLICY "demo_state_update" ON placement_dashboard_state
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "demo_state_delete" ON placement_dashboard_state;
CREATE POLICY "demo_state_delete" ON placement_dashboard_state
  FOR DELETE TO anon, authenticated USING (true);

INSERT INTO placement_dashboard_state (id)
VALUES ('demo')
ON CONFLICT (id) DO NOTHING;