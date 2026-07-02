import React, { useState } from 'react';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { LoginPayload } from '../api/auth.api';

interface LoginFormProps {
  onSubmit: (data: LoginPayload) => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, errorMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    onSubmit({ username: username.trim(), password_text: password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 text-xs font-semibold bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fadeIn">
          ⚠️ {errorMessage}
        </div>
      )}

      <Input
        label="Username"
        type="text"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="e.g., admin"
        disabled={isLoading}
      />

      <Input
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        disabled={isLoading}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full py-2.5 mt-2 text-sm font-semibold tracking-wide uppercase"
      >
        Sign In to Portal
      </Button>
    </form>
  );
};