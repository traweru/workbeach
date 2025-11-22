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
  Box,
  Paper,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTheme } from '@mui/material/styles';

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
    <FormControl sx={{ my: 1 }} fullWidth variant="outlined">
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
      {loading ? 'Signing Up...' : 'Sign Up'}
    </Button>
  );
}

function SignInLink() {
  const handleSignInClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.href = '/';
  };

  return (
    <Link 
      href="/" 
      variant="body2" 
      onClick={handleSignInClick}
      sx={{ cursor: 'pointer' }}
    >
      ALREADY HAVE AN ACCOUNT?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Sign Up</h2>;
}

function Subtitle() {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }} severity="info">
      Create your student account to get started.
    </Alert>
  );
}

function TermsCheckbox() {
  const theme = useTheme();
  return (
    <FormControlLabel
      label="I agree to the Terms and Conditions"
      control={
        <Checkbox
          name="terms"
          value="true"
          color="primary"
          required
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

export default function SignUpPage() {
  const theme = useTheme();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);
  setError('');

  const formData = new FormData(event.currentTarget);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const terms = formData.get('terms');

  if (!terms) {
    setError('Please agree to the Terms and Conditions');
    setLoading(false);
    return;
  }

  const requestBody = {
    username: email,
    password: password,
    email: email,
    firstName: 'Student',
    lastName: 'User', 
    role: 'STUDENT'
  };

  console.log('Registration request:', requestBody);
  
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
   
    const responseText = await response.text();
    console.log(' Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from server');
    }

    console.log('📥 Parsed response:', data);

    if (response.ok) {
     
      console.log('Registration successful! User ID:', data.userid);
      alert('Registration successful! You can now login.');
      window.location.href = '/'; 
    } else {
     
      console.log(' Server error:', data);
      setError(data.message || data.error || `Registration failed`);
    }
    
} catch (error) {
  console.error('Registration error:', error);
  let errorMessage = 'Registration failed. Please try again.';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  setError(errorMessage);
} finally {
  setLoading(false);
}
};

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Title />
        <Subtitle />
        
        <form onSubmit={handleRegister}>
          <CustomEmailField />
          <CustomPasswordField />
          <TermsCheckbox />
          <CustomButton loading={loading} />
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <SignInLink />
          </Box>
        </form>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Paper>
    </Box>
  );
}