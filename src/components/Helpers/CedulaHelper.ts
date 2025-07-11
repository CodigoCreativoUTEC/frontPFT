/**
 * Helper para validar y generar cédulas uruguayas
 * Implementa el algoritmo oficial de validación de cédulas de identidad uruguayas
 */

/**
 * Calcula el dígito verificador de una cédula
 * @param ci - Cédula sin dígito verificador
 * @returns Dígito verificador calculado
 */
export function validation_digit(ci: string): number {
  let a = 0;
  let i = 0;
  
  // Asegurar que tenga 7 dígitos, rellenar con ceros si es necesario
  if (ci.length <= 6) {
    for (i = ci.length; i < 7; i++) {
      ci = '0' + ci;
    }
  }
  
  // Algoritmo de validación uruguayo
  for (i = 0; i < 7; i++) {
    a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
  }
  
  if (a % 10 === 0) {
    return 0;
  } else {
    return 10 - a % 10;
  }
}

/**
 * Valida una cédula uruguaya completa
 * @param ci - Cédula completa con dígito verificador
 * @returns true si la cédula es válida, false en caso contrario
 */
export function validate_ci(ci: string): boolean {
  ci = clean_ci(ci);
  
  // Verificar que tenga al menos 7 dígitos
  if (ci.length < 7) {
    return false;
  }
  
  const dig = ci[ci.length - 1];
  ci = ci.replace(/[0-9]$/, '');
  
  return dig === validation_digit(ci).toString();
}

/**
 * Genera una cédula uruguaya aleatoria válida
 * @returns Cédula aleatoria con dígito verificador
 */
export function random_ci(): string {
  const ci = Math.floor(Math.random() * 10000000).toString();
  const fullCi = ci.substring(0, 7) + validation_digit(ci);
  return fullCi;
}

/**
 * Limpia una cédula removiendo caracteres no numéricos
 * @param ci - Cédula a limpiar
 * @returns Cédula solo con números
 */
export function clean_ci(ci: string): string {
  return ci.replace(/\D/g, '');
}

/**
 * Formatea una cédula para mostrar (agrega puntos)
 * @param ci - Cédula a formatear
 * @returns Cédula formateada (ej: 1.234.567-8)
 */
export function format_ci(ci: string): string {
  ci = clean_ci(ci);
  
  if (ci.length < 7) {
    return ci;
  }
  
  const base = ci.substring(0, ci.length - 1);
  const digit = ci[ci.length - 1];
  
  // Agregar puntos cada 3 dígitos desde la derecha
  const formatted = base.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return `${formatted}-${digit}`;
}

/**
 * Valida y formatea una cédula en tiempo real
 * @param ci - Cédula ingresada
 * @returns Objeto con información de validación y formato
 */
export function validateAndFormatCI(ci: string): {
  isValid: boolean;
  formatted: string;
  clean: string;
  error?: string;
} {
  const clean = clean_ci(ci);
  
  if (clean.length === 0) {
    return {
      isValid: false,
      formatted: ci,
      clean: clean,
      error: "La cédula no puede estar vacía"
    };
  }
  
  if (clean.length < 7) {
    return {
      isValid: false,
      formatted: ci,
      clean: clean,
      error: "La cédula debe tener al menos 7 dígitos"
    };
  }
  
  if (clean.length > 8) {
    return {
      isValid: false,
      formatted: ci,
      clean: clean,
      error: "La cédula no puede tener más de 8 dígitos"
    };
  }
  
  const isValid = validate_ci(clean);
  
  return {
    isValid,
    formatted: format_ci(clean),
    clean: clean,
    error: isValid ? undefined : "Cédula inválida"
  };
} 