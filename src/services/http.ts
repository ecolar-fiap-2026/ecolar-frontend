import { z } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 0,
    public fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const errorBody = z.object({
  mensagem: z.string().optional(),
  campos: z.record(z.string(), z.string()).optional(),
});

export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {},
): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base)
    throw new ApiError(
      "O serviço de dados ainda não está disponível. Você pode explorar o simulador enquanto a conexão é preparada.",
    );
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), 20_000);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeout.signal])
    : timeout.signal;
  try {
    const response = await fetch(`${base}${path}`, {
      ...options,
      signal,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    const raw: unknown =
      response.status === 204
        ? undefined
        : await response.json().catch(() => null);
    if (!response.ok) {
      const parsed = errorBody.safeParse(raw);
      const fallback: Record<number, string> = {
        400: "Confira os campos informados.",
        404: "O registro não foi encontrado.",
        409: "Esta alteração conflita com um registro existente. Confira os dados.",
        405: "Esta operação não está disponível no serviço.",
      };
      const message =
        response.status >= 500
          ? "O serviço está indisponível no momento. Tente novamente mais tarde."
          : parsed.data?.mensagem ||
            fallback[response.status] ||
            "Não foi possível concluir a operação.";
      throw new ApiError(message, response.status, parsed.data?.campos);
    }
    const parsed = schema.safeParse(raw);
    if (!parsed.success)
      throw new ApiError(
        "O serviço respondeu em um formato inesperado. Não foi possível confirmar os dados. Atualize a lista antes de tentar gravar novamente.",
        response.status,
      );
    return parsed.data;
  } catch (error) {
    if (error instanceof ApiError || options.signal?.aborted) throw error;
    throw new ApiError(
      timeout.signal.aborted
        ? "O serviço demorou para responder. Se você estava salvando, consulte o histórico antes de repetir a operação."
        : "Não foi possível conectar ao serviço. Confira sua conexão e tente novamente. Se estava salvando, consulte a lista antes de repetir.",
    );
  } finally {
    clearTimeout(timer);
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}
