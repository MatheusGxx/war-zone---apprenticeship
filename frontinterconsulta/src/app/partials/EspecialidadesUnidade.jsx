export const EspecialidadesUnidades = (code) => {
    // Inicialize um array para armazenar as especialidades
    let especialidades = []
    
    // Para cada código no array, adicione as especialidades correspondentes
    code.forEach((data) => {
        especialidades.push(`${data} - Ortopedista e Traumatologista`);
        especialidades.push(`${data} - Psiquiatria`);
        especialidades.push(`${data} - Ginecologia`);
        especialidades.push(`${data} - Neurocirurgia`);
        especialidades.push(`${data} - Cardiologia`);
        especialidades.push(`${data} - Clínico Geral`);
    });

    // Retorne o array de especialidades
    return especialidades
}
