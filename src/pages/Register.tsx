import Form from "../components/LoginRegisterForm";

/**
 * Returns register form
 */

function Register() {
  return <Form route="/api/user/register/" method="register" />;
}

export default Register;
