import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Flex,
  Loader,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constants";
import api from "../utils/api";
import displayError from "../utils/displayError";

/**
 * Returns form for logging or registering the user.
 */

type FormProps = {
  route: string;
  method: string;
};

export default function Form({ route, method }: FormProps) {
  const name = method === "login" ? "Login" : "Register";
  const navigate = useNavigate();

  const schema = z.object({
    username: z.string().min(1, "Username is required").trim().toLowerCase(),
    password: z
      .string("Password is required")
      .min(6, "Password must contain at least 6 characters")
      .regex(/^(?!^\d+$).*/, "Password cannot be entirely numeric")
      .trim(),
  });

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const username = data.username;
    const password = data.password;

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      setError("root", { message: displayError(err) });
    }
  };

  return (
    <>
      <Stack mt={140} maw={500} mx="auto" align="center">
        <Title mb="lg" order={1}>
          {name}
        </Title>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: 300 }}>
          <fieldset
            disabled={isSubmitting}
            style={{ border: "none", padding: 0, margin: 0 }}
          >
            <TextInput
              {...register("username")}
              error={errors.username && errors.username.message}
              size="xl"
              placeholder="Username"
            />
            <PasswordInput
              {...register("password")}
              error={errors.password && errors.password.message}
              size="xl"
              mt="md"
              placeholder="Password"
            />
          </fieldset>

          {errors.root && (
            <Text size="lg" mt="md" c="red.8">
              {errors.root.message}
            </Text>
          )}

          {isSubmitting ? (
            <Flex justify="center">
              <Loader mt="md" />
            </Flex>
          ) : (
            <Button type="submit" size="lg" mt="md" fullWidth>
              {name}
            </Button>
          )}
        </form>
        <Link to={`/${name === "Login" ? "register" : "login"}`}>
          {name === "Login" ? "Register" : "Login"} here
        </Link>
      </Stack>
    </>
  );
}
