import { Roles } from "./enum/role.enum";

export const endPoints = {
    all: [Roles.ADMIN, Roles.STUDENT , Roles.DOCTOR, Roles.TASMEA_HIFZ_SUPERVISOR, Roles.TASMEA_SUPERVISOR, Roles.COLLEGE_SUPERVISOR],
    adminOnly: [Roles.ADMIN],
    doctorOnly: [Roles.DOCTOR],
    adminOrDoctorOnly: [Roles.ADMIN, Roles.DOCTOR],
    studentOnly: [Roles.STUDENT],
    collegeSupervisorOnly: [Roles.COLLEGE_SUPERVISOR],
    collegeSupervisorOrAdminOnly: [Roles.ADMIN, Roles.COLLEGE_SUPERVISOR],
    supervisorOnly: [Roles.TASMEA_HIFZ_SUPERVISOR, Roles.TASMEA_SUPERVISOR, Roles.COLLEGE_SUPERVISOR],
    supervisorOrStudentOnly: [Roles.STUDENT, Roles.TASMEA_HIFZ_SUPERVISOR, Roles.TASMEA_SUPERVISOR, Roles.COLLEGE_SUPERVISOR],
    tasmeaifzSupervisorOnly: [Roles.TASMEA_HIFZ_SUPERVISOR],
    doctorOrTasmeaifzSupervisorOnly: [Roles.TASMEA_HIFZ_SUPERVISOR, Roles.DOCTOR],
};