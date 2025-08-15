import { apiClient } from "@/api/api-client";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogData {
  level?: LogLevel;
  message: string;
  data?: any;
  error?: any;
  timestamp?: string;
  userAgent?: string;
}

class ClientLogger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private async sendToServer(logData: LogData) {
    try {
      // 프로덕션 환경이거나 중요한 에러인 경우에만 서버로 전송
      if (this.isProduction || logData.level === "error") {
        await apiClient.post("/api/logs/client", {
          ...logData,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      // 로깅 실패는 조용히 처리
      if (this.isDevelopment) {
        console.error("Failed to send log to server:", error);
      }
    }
  }

  private formatMessage(level: LogLevel, message: string) {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      debug: "🔍",
    }[level];

    return `${emoji} [${timestamp}] ${message}`;
  }

  info(message: string, data?: any) {
    const formattedMessage = this.formatMessage("info", message);

    if (this.isDevelopment) {
      console.log(formattedMessage, data);
    }

    this.sendToServer({
      level: "info",
      message,
      data,
    });
  }

  warn(message: string, data?: any) {
    const formattedMessage = this.formatMessage("warn", message);

    if (this.isDevelopment) {
      console.warn(formattedMessage, data);
    }

    this.sendToServer({
      level: "warn",
      message,
      data,
    });
  }

  error(message: string, error?: any, data?: any) {
    const formattedMessage = this.formatMessage("error", message);

    // 에러는 항상 콘솔에 출력
    console.error(formattedMessage, error, data);

    // 에러 객체 직렬화
    const serializedError = error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
          ...error,
        }
      : undefined;

    this.sendToServer({
      level: "error",
      message,
      error: serializedError,
      data,
    });
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage("debug", message);
      console.debug(formattedMessage, data);
    }

    // 디버그 로그는 개발 환경에서만 서버로 전송
    if (this.isDevelopment) {
      this.sendToServer({
        level: "debug",
        message,
        data,
      });
    }
  }

  // 웹뷰 전용 로깅
  webview(message: string, data?: any) {
    const webviewInfo = {
      ...data,
    };

    this.info(`[WebView Log] ${message}`, webviewInfo);
  }

  // 인증 관련 로깅
  auth(message: string, data?: any) {
    this.info(`[Auth] ${message}`, data);
  }

  // API 호출 로깅
  api(message: string, data?: any) {
    this.debug(`[API] ${message}`, data);
  }

  // 성능 측정
  performance(message: string, startTime: number, data?: any) {
    const duration = Date.now() - startTime;
    this.info(`[Performance] ${message} (${duration}ms)`, {
      duration,
      ...data,
    });
  }
}

// 싱글톤 인스턴스
export const logger = new ClientLogger();
