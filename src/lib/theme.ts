export const themeColors = {
  // 라이트 모드 색상
  light: {
    background: {
      primary: 'bg-[rgb(var(--bg-primary))]',
      secondary: 'bg-[rgb(var(--bg-secondary))]',
      tennis: 'bg-gradient-to-br from-primary-50 via-secondary-50 to-tennis-lime-50',
      glass: 'bg-gradient-glass backdrop-blur-lg',
      raw: '#f0fdf4', // status bar용 실제 색상 값
      headerRaw: 'rgba(255, 255, 255, 0.95)', // header glass 색상
    },
    text: {
      primary: 'text-[rgb(var(--text-primary))]',
      secondary: 'text-[rgb(var(--text-secondary))]',
      tennis: 'text-primary-600',
      inverse: 'text-white',
    },
    border: {
      primary: 'border-[rgb(var(--border-primary))]',
      tennis: 'border-primary-200',
    },
    surface: {
      card: 'bg-white/90 backdrop-blur-md border border-white/20',
      glassCard: 'bg-white/80 backdrop-blur-xl border border-white/30',
    }
  },
  // 다크 모드 색상
  dark: {
    background: {
      primary: 'dark:bg-neutral-900',
      secondary: 'dark:bg-neutral-800',
      tennis: 'dark:bg-gradient-to-b dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800',
      glass: 'dark:bg-gradient-glass-dark dark:backdrop-blur-lg',
      raw: '#0f172a', // status bar용 실제 색상 값
      headerRaw: 'rgba(17, 24, 39, 0.95)', // header glass 색상 (dark)
    },
    text: {
      primary: 'dark:text-[rgb(var(--text-primary))]',
      secondary: 'dark:text-[rgb(var(--text-secondary))]',
      tennis: 'dark:text-primary-400',
      inverse: 'dark:text-neutral-900',
    },
    border: {
      primary: 'dark:border-[rgb(var(--border-primary))]',
      tennis: 'dark:border-primary-700',
    },
    surface: {
      card: 'dark:bg-neutral-900/90 dark:backdrop-blur-md dark:border-neutral-800/30',
      glassCard: 'dark:bg-neutral-900/80 dark:backdrop-blur-xl dark:border-neutral-700/30',
    }
  }
}

// 테니스 테마 그라디언트
export const tennisGradients = {
  primary: 'bg-gradient-tennis', // 메인 초록-노랑 그라디언트
  soft: 'bg-gradient-tennis-soft', // 부드러운 버전
  court: 'bg-gradient-primary', // 초록 계열
  ball: 'bg-gradient-secondary', // 노랑 계열
  dark: 'bg-gradient-dark-tennis', // 다크모드용
}

// 상태별 색상
export const statusColors = {
  success: {
    bg: 'bg-status-success-500',
    text: 'text-status-success-600',
    border: 'border-status-success-200',
    gradient: 'from-status-success-400 to-status-success-600'
  },
  warning: {
    bg: 'bg-status-warning-500',
    text: 'text-status-warning-600',
    border: 'border-status-warning-200',
    gradient: 'from-status-warning-400 to-status-warning-600'
  },
  error: {
    bg: 'bg-status-error-500',
    text: 'text-status-error-600',
    border: 'border-status-error-200',
    gradient: 'from-status-error-400 to-status-error-600'
  },
  info: {
    bg: 'bg-status-info-500',
    text: 'text-status-info-600',
    border: 'border-status-info-200',
    gradient: 'from-status-info-400 to-status-info-600'
  }
}

// 컴포넌트별 테마 클래스 조합 헬퍼
export const getThemeClasses = (variant: 'light' | 'dark' | 'both' = 'both') => {
  const light = themeColors.light
  const dark = themeColors.dark
  
  switch (variant) {
    case 'light':
      return light
    case 'dark':
      return dark
    case 'both':
    default:
      return {
        background: {
          primary: `${light.background.primary} ${dark.background.primary}`,
          secondary: `${light.background.secondary} ${dark.background.secondary}`,
          tennis: `${light.background.tennis} ${dark.background.tennis}`,
          glass: `${light.background.glass} ${dark.background.glass}`,
        },
        text: {
          primary: `${light.text.primary} ${dark.text.primary}`,
          secondary: `${light.text.secondary} ${dark.text.secondary}`,
          tennis: `${light.text.tennis} ${dark.text.tennis}`,
          inverse: `${light.text.inverse} ${dark.text.inverse}`,
        },
        border: {
          primary: `${light.border.primary} ${dark.border.primary}`,
          tennis: `${light.border.tennis} ${dark.border.tennis}`,
        },
        surface: {
          card: `${light.surface.card} ${dark.surface.card}`,
          glassCard: `${light.surface.glassCard} ${dark.surface.glassCard}`,
        }
      }
  }
}

// 테니스 테마 색상 유틸리티
export const tennisTheme = {
  court: {
    50: 'tennis-court-50',
    100: 'tennis-court-100',
    200: 'tennis-court-200',
    300: 'tennis-court-300',
    400: 'tennis-court-400',
    500: 'tennis-court-500',
    600: 'tennis-court-600',
    700: 'tennis-court-700',
    800: 'tennis-court-800',
    900: 'tennis-court-900',
    950: 'tennis-court-950',
  },
  ball: {
    50: 'tennis-ball-50',
    100: 'tennis-ball-100',
    200: 'tennis-ball-200',
    300: 'tennis-ball-300',
    400: 'tennis-ball-400',
    500: 'tennis-ball-500',
    600: 'tennis-ball-600',
    700: 'tennis-ball-700',
    800: 'tennis-ball-800',
    900: 'tennis-ball-900',
    950: 'tennis-ball-950',
  },
  lime: {
    50: 'tennis-lime-50',
    100: 'tennis-lime-100',
    200: 'tennis-lime-200',
    300: 'tennis-lime-300',
    400: 'tennis-lime-400',
    500: 'tennis-lime-500',
    600: 'tennis-lime-600',
    700: 'tennis-lime-700',
    800: 'tennis-lime-800',
    900: 'tennis-lime-900',
    950: 'tennis-lime-950',
  }
}