'use client';

import { useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { Avatar, Card, CodeBlock, Timestamp } from '@/components/rhds/data-display';
import { Button, Dialog } from '@/components/rhds/actions';
import { Alert } from '@/components/rhds/feedback';
import { Disclosure } from '@/components/rhds/layout';
import { Switch, Select, Option } from '@/components/rhds/forms';

export function SettingsPanel({ profile }: { profile: UserProfile }) {
  const [emailNotif, setEmailNotif] = useState(profile.preferences.emailNotifications);
  const [smsNotif, setSmsNotif] = useState(profile.preferences.smsNotifications);
  const [pushNotif, setPushNotif] = useState(profile.preferences.pushNotifications);
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowDialog(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="page-grid">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      {showSuccess && (
        <Alert variant="inline" state="success" dismissable onClose={() => setShowSuccess(false)}>
          <h4 slot="header">Settings saved</h4>
          <p>Your preferences have been updated successfully.</p>
        </Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--rh-space-xl, 24px)',  width: '100%' }}>
        <Card>
          <h3 slot="header">Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Avatar name={profile.name}>
              {profile.name}
              <span slot="subtitle">{profile.role}</span>
            </Avatar>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: '0.9rem' }}>
              <strong>Email</strong>
              <span>{profile.email}</span>
              <strong>Member since</strong>
              <Timestamp date={profile.joinDate} dateFormat="long" />
              <strong>Timezone</strong>
              <span>{profile.preferences.timezone.replace('_', ' ').split('/').pop()}</span>
            </div>
            <Button variant="tertiary">Edit Profile</Button>
          </div>
        </Card>

        <Card>
          <h3 slot="header">Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>Email notifications</strong>
                <p style={{ color: 'var(--rh-color-text-secondary, #666)', fontSize: '0.9rem' }}>
                  Receive order updates and product alerts via email
                </p>
              </div>
              <Switch
                checked={emailNotif || undefined}
                accessibleLabel="Email notifications"
                onChange={() => setEmailNotif(!emailNotif)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>SMS notifications</strong>
                <p style={{ color: 'var(--rh-color-text-secondary, #666)', fontSize: '0.9rem' }}>
                  Receive critical alerts via text message
                </p>
              </div>
              <Switch
                checked={smsNotif || undefined}
                accessibleLabel="SMS notifications"
                onChange={() => setSmsNotif(!smsNotif)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>Push notifications</strong>
                <p style={{ color: 'var(--rh-color-text-secondary, #666)', fontSize: '0.9rem' }}>
                  Browser push notifications for real-time updates
                </p>
              </div>
              <Switch
                checked={pushNotif || undefined}
                accessibleLabel="Push notifications"
                onChange={() => setPushNotif(!pushNotif)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 slot="header">Locale</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <strong>Language</strong>
              <Select accessibleLabel="Language" value={profile.preferences.language}>
                <Option value="en-US">English (US)</Option>
                <Option value="en-GB">English (UK)</Option>
                <Option value="es">Español</Option>
                <Option value="fr">Français</Option>
                <Option value="de">Deutsch</Option>
                <Option value="ja">日本語</Option>
              </Select>
            </div>
            <div>
              <strong>Timezone</strong>
              <Select accessibleLabel="Timezone" value={profile.preferences.timezone}>
                <Option value="America/New_York">Eastern Time (ET)</Option>
                <Option value="America/Chicago">Central Time (CT)</Option>
                <Option value="America/Denver">Mountain Time (MT)</Option>
                <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
                <Option value="Europe/London">Greenwich Mean Time (GMT)</Option>
                <Option value="Europe/Berlin">Central European Time (CET)</Option>
                <Option value="Asia/Tokyo">Japan Standard Time (JST)</Option>
              </Select>
            </div>
          </div>
        </Card>

        <Card>
          <h3 slot="header">API Access</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p>Your API key for programmatic access:</p>
            <CodeBlock>
              <code>{profile.apiKey}</code>
            </CodeBlock>
            <p style={{ color: 'var(--rh-color-text-secondary, #666)', fontSize: '0.9rem' }}>
              Keep this key secret. Do not share it in public repositories.
            </p>
          </div>
        </Card>

      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--rh-space-xl, 24px)' }}>
        <Disclosure>
          <h3 slot="summary">Danger Zone</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--rh-color-text-secondary, #666)' }}>
              These actions are destructive and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" danger>Reset All Data</Button>
              <Button variant="secondary" danger>Delete Account</Button>
            </div>
          </div>
        </Disclosure>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => {
            setEmailNotif(profile.preferences.emailNotifications);
            setSmsNotif(profile.preferences.smsNotifications);
            setPushNotif(profile.preferences.pushNotifications);
          }}>
            Reset
          </Button>
          <Button variant="primary" onClick={() => setShowDialog(true)}>
            Save Changes
          </Button>
        </div>
      </div>

      {showDialog && (
        <Dialog open variant="small" onClose={() => setShowDialog(false)}>
          <h2 slot="header">Save changes?</h2>
          <p>Are you sure you want to update your settings? This will take effect immediately.</p>
          <div slot="footer" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Confirm
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
