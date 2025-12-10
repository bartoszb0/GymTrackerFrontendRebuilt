interface ErrorResponse {
  data?: {
    detail?: string;
    [key: string]: unknown;
  };
}

export default function displayError(error: unknown): string {
  console.error(error);

  let message = "An unexpected error occurred.";

  if (isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse["data"];

    if (data?.detail) {
      message = data.detail;
    } else if (data && typeof data === "object") {
      message = Object.values(data).flat().join(" ");
    } else if (error.message) {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return message;
}

function isAxiosError(error: any): error is {
  response?: { data?: any };
  message?: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    "message" in error
  );
}
