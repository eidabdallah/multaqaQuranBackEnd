import { dailyFollowUpCreationAttributes } from "../../interface/DailyFollowUp/dailyFollowUpAttributes";
import DailyFollowUp from "../../Model/dailyFollowUp.model";
import { BaseService } from "../base.service";
import { ICrudService } from './../../interface/crud.interface';
import { CacheManager } from './../../utils/nodeCache/cache';
import { getSemesterInfo, buildSemesterDateRange, semesterOrder } from './../../utils/ComputeSemester/getSemesterInfo';
import User from './../../Model/user.model';
import Halaqa from './../../Model/halaqa.model';
import Exam from './../../Model/exam.model';
import { col, fn, Op } from "sequelize";

export default class DailyFollowUpService extends BaseService<DailyFollowUp> implements ICrudService<DailyFollowUp, dailyFollowUpCreationAttributes> {
    constructor() {
        super(DailyFollowUp);
    }
    async create(data: dailyFollowUpCreationAttributes): Promise<DailyFollowUp> {
        const result = await DailyFollowUp.create(data);
        CacheManager.del(`dailyFollowUp_${data.userId}`);
        return result;
    }
    async update(id: number, data: Partial<DailyFollowUp>): Promise<number> {
        const [affectedCount] = await DailyFollowUp.update(data, { where: { id } });
        if (affectedCount > 0) {
            CacheManager.del(`dailyFollowUp_${data.userId}`);
        }
        return affectedCount;
    }
    async delete(id: number): Promise<number> {
        const deleted = await DailyFollowUp.destroy({ where: { id } });
        if (deleted > 0) {
            CacheManager.del(`dailyFollowUp_${id}`);
        }
        return deleted;
    }
    async getStudentFollowUps(userId: number, currentSemesterOnly: boolean = false) {
        const cacheKey = `dailyFollowUp_${userId}`;
        let followUps = CacheManager.get(cacheKey);
        if (!followUps) {
            const today = new Date();
            const { semester, semesterYear } = getSemesterInfo(today);
            const dateRange = buildSemesterDateRange(semester, semesterYear);

            followUps = await DailyFollowUp.findAll({
                where: {
                    userId,
                    ...(currentSemesterOnly ? { date: dateRange } : {})
                },
                order: [['date', 'DESC']]
            });
            if (Array.isArray(followUps) && followUps.length > 0) {
                CacheManager.set(cacheKey, followUps);
            }
        }
        if (!currentSemesterOnly) {
            return followUps;
        }
        const { semester, semesterYear } = getSemesterInfo(new Date());
        return {
            semesterInfo: {
                message: `${semester} ${semesterYear}`,
                followUps
            }
        };
    }
      private groupFollowUpsBySemester(followUps: any[]) {
        const grouped: { [key: string]: any[] } = {};

        followUps.forEach(item => {
            const { semester, semesterYear } = getSemesterInfo(new Date(item.date));
            const key = `${semester} ${semesterYear}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        });
        return grouped;
    }

    private sortGroupedFollowUps(grouped: { [key: string]: any[] }) {
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            const [semesterA, yearA] = a.split(' ');
            const [semesterB, yearB] = b.split(' ');

            if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
            return semesterOrder(semesterB) - semesterOrder(semesterA);
        });
        return sortedKeys.map(key => ({
            semester: key,
            followUps: grouped[key]
        }));
    }

    async getDailyFollowUpForStudent(userId: number): Promise<any> {
        const followUpsResult : any = await this.getStudentFollowUps(userId);
        const followUps = Array.isArray(followUpsResult) ? followUpsResult : followUpsResult.semesterInfo?.followUps || [];
        const grouped = this.groupFollowUpsBySemester(followUps);
        const sortedResult = this.sortGroupedFollowUps(grouped);
        return sortedResult;
    }

    private buildIncludeClause(college?: string, halaqaName?: string, gender?: string) {
        const include: any[] = [];
        if (college || halaqaName || gender) {
            const userInclude: any = {
                model: User,
                as: 'user',
                where: {},
                attributes: [],
                include: []
            };
            if (college) userInclude.where.CollegeName = college;
            const halaqaWhere: any = {};
            if (halaqaName) halaqaWhere.halaqaName = halaqaName;
            if (gender) halaqaWhere.gender = gender;

            if (halaqaName || gender) {
                userInclude.include.push({
                    model: Halaqa,
                    as: 'Halaqa',
                    where: halaqaWhere,
                    attributes: []
                });
            }
            include.push(userInclude);
        }
        return include;
    }

    private buildWhereClause() {
        const today = new Date();
        const { semester, semesterYear } = getSemesterInfo(today);
        const dateFilter = buildSemesterDateRange(semester, semesterYear);
        const where = dateFilter ? { date: dateFilter } : {};
        return { where, semester, semesterYear };
    }

    private async getExamCount(college?: string, halaqaName?: string, gender?: string): Promise<number> {
        const examInclude: any[] = [
            {
                model: User,
                as: 'student',
                where: {},
                include: []
            }
        ];
        if (college) examInclude[0].where.CollegeName = college;
        if (halaqaName || gender) {
            const halaqaWhere: any = {};
            if (halaqaName) halaqaWhere.halaqaName = halaqaName;
            if (gender) halaqaWhere.gender = gender;
            examInclude[0].include.push({
                model: Halaqa,
                as: 'Halaqa',
                where: halaqaWhere,
                attributes: []
            });
        }
        return await Exam.count({
            where: { grade: { [Op.not]: null } },
            include: examInclude,
        });
    }

    async getStatistics(filters: { college?: string, halaqaName?: string, gender?: string }) {
        const { college, halaqaName, gender } = filters;
        const dataWhere = this.buildWhereClause();
        const include = this.buildIncludeClause(college, halaqaName, gender);

        const [totals] : any[] = await DailyFollowUp.findAll({
            where: dataWhere.where,
            include,
            attributes: [
                [fn('SUM', col('pageNumberSaved')), 'totalSavedPages'],
                [fn('SUM', col('pageNumberReview')), 'totalReviewPages'],
            ],
            raw: true
        });

        const totalSavedPages = parseInt(totals.totalSavedPages || 0);
        const totalReviewPages = parseInt(totals.totalReviewPages || 0);
        const examCount = await this.getExamCount(college, halaqaName, gender);

        return {
            message: `إحصائيات ${dataWhere.semester} ${dataWhere.semesterYear}`,
            totalSavedPages,
            totalReviewPages,
            examCount
        };
    }
}
