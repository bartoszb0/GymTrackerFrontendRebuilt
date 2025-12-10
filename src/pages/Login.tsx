import Form from "../components/LoginRegisterForm";

/**
 * Returns login form
 */

function Login() {
  return (
    <>
      <Form route="/api/token/" method="login" />
    </>
  );
}

export default Login;
