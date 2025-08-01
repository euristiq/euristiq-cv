export const storageError = () => ({
  data: null,
  error: {
    message: "Error occurred while accessing storage."
  }
});

export const credentialsError = () => ({
  data: null,
  error: {
    message: "Error occurred while accessing credentials."
  }
});

export const notFoundError = (id: number) => ({
  data: null,
  error: {
    message: `Resume ${id} not found.`
  }
});

export const notFoundKeyError = (key: string) => ({
  data: null,
  error: {
    message: `Resume ${key} not found.`
  }
});

export const success = <T>(data: T) => ({
  data,
  error: null
});
