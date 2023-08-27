import React, { useContext } from "react";
import { JobsContext } from "../services/jobcontext";
import { Job } from "../models/Job";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const JobsAppliedDateGraph: React.FC = () => {
    const { jobs } = useContext(JobsContext);

    // Helper function to check if a date is today
    const isToday = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
    };

    const getStartOfWeek = (date: Date): Date => {
        const result = new Date(date);
        const day = date.getDay();
        const difference = date.getDate() - day;
        result.setDate(difference);
        result.setHours(0, 0, 0, 0);
        return result;
    };

    const isInSameWeek = (date1: Date, date2: Date): boolean => {
        return getStartOfWeek(date1).getTime() === getStartOfWeek(date2).getTime();
    };

    const isInCurrentMonth = (date: Date): boolean => {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const getWeeksInMonth = (date: Date): { start: Date, end: Date }[] => {
        const weeks: { start: Date, end: Date }[] = [];
        const month = date.getMonth();
        date.setDate(1);
        while (date.getMonth() === month) {
            weeks.push({
                start: getStartOfWeek(new Date(date)),
                end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - date.getDay()))
            });
            date.setDate(date.getDate() + (7 - date.getDay()));
        }
        return weeks;
    };

    const today = new Date();

    const jobsAppliedToday: Job[] = jobs.filter(job => isToday(new Date(job.dateapplied)));
    const jobsAppliedThisWeek: Job[] = jobs.filter(job => isInSameWeek(new Date(job.dateapplied), today));
    const jobsAppliedThisMonth: Job[] = jobs.filter(job => isInCurrentMonth(new Date(job.dateapplied)));

    const weeks = getWeeksInMonth(today);
    const dataForBarChart = weeks.map(week => ({
        name: `${week.start.getDate()}-${week.end.getDate()}`,
        Jobs: jobs.filter(job => {
            const jobDate = new Date(job.dateapplied);
            return jobDate >= week.start && jobDate <= week.end;
        }).length
    }));

    return (
        <div>
            <p>Hi I'm the jobs applied graph</p>
            <p>Jobs applied today: {jobsAppliedToday.length}</p>
            <p>Jobs applied this week: {jobsAppliedThisWeek.length}</p>
            <p>Jobs applied this month: {jobsAppliedThisMonth.length}</p>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={dataForBarChart}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Jobs" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
