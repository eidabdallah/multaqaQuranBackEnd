import { Op } from "sequelize";

export function getSemesterInfo(date: Date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let semester = '';
    let semesterYear = '';
    if (month >= 9) {
        semester = 'الفصل الأول';
        semesterYear = `${year}/${year + 1}`;
    } else if (month === 1) {
        semester = 'الفصل الأول';
        semesterYear = `${year - 1}/${year}`;
    } else if (month >= 2 && month <= 6) {
        semester = 'الفصل الثاني';
        semesterYear = `${year - 1}/${year}`;
    } else if (month === 7 || month === 8) {
        semester = 'الفصل الصيفي';
        semesterYear = `${year - 1}/${year}`;
    }

    return { semester, semesterYear };
}

export function semesterOrder(semester: string) {
    if (semester === 'الفصل الصيفي') return 3;
    if (semester === 'الفصل الثاني') return 2;
    if (semester === 'الفصل الأول') return 1;
    return 0;
}

export function buildSemesterDateRange(semester: string, semesterYear: string) {
    const [startYear, endYear] = semesterYear.split('/').map(Number);

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (semester === 'الفصل الأول') {
        startDate = new Date(`${startYear}-09-01`);
        endDate = new Date(`${endYear}-01-31`);
    } else if (semester === 'الفصل الثاني') {
        startDate = new Date(`${endYear}-02-01`);
        endDate = new Date(`${endYear}-06-30`);
    } else if (semester === 'الفصل الصيفي') {
        startDate = new Date(`${endYear}-07-01`);
        endDate = new Date(`${endYear}-08-31`);
    }

    if (!startDate || !endDate) return undefined;

    return {
        [Op.between]: [startDate, endDate]
    };
}