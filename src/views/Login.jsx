import {
  Container,
  TextField,
  Button,
  Typography,
  CssBaseline,
  Card,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useLoading } from "../store/loading_store";
import { login } from "../services/auth_service";
import { useErrorContext } from "../store/error_store";

const height = window.screen.height / 2;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loadingDispatch } = useLoading();
  const { setErrorFun } = useErrorContext();
  const startLoading = () => {
    loadingDispatch({ type: "SET_LOADING" });
  };

  const stopLoading = () => {
    loadingDispatch({ type: "SET_NOT_LOADING" });
  };

  const loginFunc = async () => {
    try {
      startLoading();
      await login(email, password);
      stopLoading();
      setErrorFun(``);
    } catch (error) {
      setErrorFun(`${error}`);
    }
  };
  return (
    <Container
      style={{
        height: height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      component="main"
      maxWidth="xs"
    >
      <CssBaseline />
      <Typography
        component="h1"
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        padding="32px 0"
      >
        Login as admin
      </Typography>
      <Divider sx={{ backgroundColor: "black" }} />
      <Card sx={{ padding: "32px", maxWidth: 800 }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            loginFunc();
          }}
        >
          Sign In
        </Button>
      </Card>
    </Container>
  );
};

export default Login;
