/*
  # Add Global Notification Settings

  1. New Tables
    - `global_notification_settings`
      - `id` (uuid, primary key)
      - `desktop_notifications_enabled` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `notification_emails`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their settings

  3. Important Notes
    - Global notification settings are per-user (in a full app this would be tied to auth.uid())
    - For demo purposes, we'll allow any authenticated user to access
    - Email addresses can be added, edited, and deleted
*/

CREATE TABLE IF NOT EXISTS global_notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  desktop_notifications_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE global_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to global_notification_settings"
  ON global_notification_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to notification_emails"
  ON notification_emails
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM global_notification_settings) THEN
    INSERT INTO global_notification_settings (desktop_notifications_enabled) VALUES (false);
  END IF;
END $$;
