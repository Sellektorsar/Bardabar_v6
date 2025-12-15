import { useCallback, useState } from "react";

import { ApiError, ProjectPausedError, isNetworkError } from "../api/client";

type ApiState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isProjectPaused: boolean;
};

interface UseApiState<T> extends ApiState<T> {}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<T | null>;
  reset: () => void;
}

/**
 * Хук для выполнения API-запросов с обработкой состояний загрузки и ошибок
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    onProjectPaused?: () => void;
  },
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isProjectPaused: false,
  });

  const execute = useCallback(async (): Promise<T | null> => {
    setState((prev: ApiState<T>) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, isLoading: false, error: null, isProjectPaused: false });
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Неизвестная ошибка";

      if (error instanceof ProjectPausedError) {
        setState((prev: ApiState<T>) => ({
          ...prev,
          isLoading: false,
          isProjectPaused: true,
          error: "Сервер временно недоступен",
        }));
        options?.onProjectPaused?.();
      } else if (error instanceof ApiError) {
        setState((prev: ApiState<T>) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        options?.onError?.(error);
      } else if (error instanceof Error && isNetworkError(error.message)) {
        setState((prev: ApiState<T>) => ({
          ...prev,
          isLoading: false,
          isProjectPaused: true,
          error: "Нет связи с сервером",
        }));
        options?.onProjectPaused?.();
      } else {
        setState((prev: ApiState<T>) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        options?.onError?.(error as Error);
      }

      return null;
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isProjectPaused: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Хук для мутаций (POST, PATCH, DELETE) с обработкой состояний
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  },
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await mutationFn(variables);
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Ошибка";
        setError(message);
        options?.onError?.(err as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, options],
  );

  return { mutate, isLoading, error };
}
