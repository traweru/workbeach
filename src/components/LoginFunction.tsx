import * as React from 'react';
import {
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
  Snackbar,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import type { AuthResponse } from '@toolpad/core/SignInPage';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}


function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        required
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}


function CustomButton({ loading }: { loading: boolean }) {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
      disabled={loading}
    >
      {loading ? 'Logging in...' : 'Log In'}
    </Button>
  );
}


function SignUpLink() {
  const handleSignUpClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = '/register';
  };

  return (
    <Link 
      href="/register" 
      variant="body2" 
      onClick={handleSignUpClick}
      sx={{ cursor: 'pointer' }}
    >
      NEW STUDENT?
    </Link>
  );
}


function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}


function Subtitle() {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }} severity="warning">
      We are investigating an ongoing outage.
    </Alert>
  );
}


function RememberMeCheckbox() {
  const theme = useTheme();
  return (
    <FormControlLabel
      label="Remember me"
      control={
        <Checkbox
          name="remember"
          value="true"
          color="primary"
          sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
        />
      }
      slotProps={{
        typography: {
          color: 'textSecondary',
          fontSize: theme.typography.pxToRem(14),
        },
      }}
    />
  );
}

export default function LoginFunction() {
  const theme = useTheme();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();

const handleSignIn = async (_provider: unknown, formData: FormData): Promise<AuthResponse> => {
  setLoading(true);
  setError('');

  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Sending login request to Spring...');

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful:', data);
      
      const userData = {
        username: data.username,
        roles: data.roles,
        authenticated: true
      };
      
      
      login(userData, data.token); 
      window.location.href = '/main';
      
      return { type: 'Success' as const };
    } else {
      const errorMessage = data.message || data.error || 'Login failed';
      setError(errorMessage);
      return { type: 'CredentialsSignin' as const, error: errorMessage };
    }
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Network error';
    setError(errorMessage);
    return { type: 'CredentialsSignin' as const, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        slots={{
          title: Title,
          subtitle: Subtitle,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: () => <CustomButton loading={loading} />,
          signUpLink: SignUpLink,
          rememberMe: RememberMeCheckbox
        }}
        slotProps={{ form: { noValidate: true } }}
        providers={providers}
      />
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </AppProvider>
  );
}