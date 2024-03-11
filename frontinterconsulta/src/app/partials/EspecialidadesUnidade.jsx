export const unitSpecialties = [
    'UPA01 - Ortopedista e Traumatologista',
    'UPA01 - Psiquiatria',
    'UPA01 - Ginecologia',
    'UPA01 - Neurocirurgia',
    'UPA01 - Cardiologia'
] as const;

export type UnitSpecialty = typeof unitSpecialties[number];
