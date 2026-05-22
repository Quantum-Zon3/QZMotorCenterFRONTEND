interface ErrorLike {
  message?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

const isErrorLike = (value: unknown): value is ErrorLike =>
  typeof value === "object" && value !== null;

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (!isErrorLike(error)) {
    return fallback;
  }

  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
    error.message ??
    fallback
  );
};

