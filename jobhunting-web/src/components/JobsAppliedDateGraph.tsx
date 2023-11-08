import React, { useContext, useState } from "react";
import { JobsContext } from "../services/jobcontext";
import { Job } from "../models/Job";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from "styled-components";
import {device} from "../common/ScreenSizes";

export const JobsAppliedDateGraph: React.FC = () => {
    const { jobs } = useContext(JobsContext);

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

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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
    const currentMonth = new Date().getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth - 1, daysInMonth);
    const jobsAppliedToday: Job[] = jobs.filter(job => isToday(new Date(job.dateapplied)));
    const jobsAppliedThisWeek: Job[] = jobs.filter(job => isInSameWeek(new Date(job.dateapplied), today));
    const jobsAppliedThisMonth: Job[] = jobs.filter(job => {
        const jobDate = new Date(job.dateapplied);
        return jobDate >= firstDay && jobDate <= lastDay;
    });

    const weeks = getWeeksInMonth(new Date(selectedYear, selectedMonth - 1, 1)); // Use selectedMonth and selectedYear here

    const dataForBarChart = weeks.map(week => ({
        name: `${week.start.getDate()}-${week.end.getDate()}`,
        Jobs: jobs.filter(job => {
            const jobDate = new Date(job.dateapplied);
            return jobDate >= week.start && jobDate <= week.end;
        }).length
    }));

// there is an issue in that the graph is not updating, I need to update this component each time the create job button is pushed

    return (
        <JobsAppliedDateGraphDiv>
            <GraphContainer>
                <MonthPickerDiv>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </MonthPickerDiv>
                {selectedMonth === currentMonth ? (
                    <NumberOfJobsAppliedDiv>
                        <p>Jobs Applied:</p>
                        <p>Today: {jobsAppliedToday.length}</p>
                        <p>This Week: {jobsAppliedThisWeek.length}</p>
                        <p>Current Month: {jobsAppliedThisMonth.length}</p>
                    </NumberOfJobsAppliedDiv>
                ) : (
                    <NumberOfJobsAppliedDiv>
                        <p>Jobs applied for in {monthNames[selectedMonth - 1]}: {jobsAppliedThisMonth.length}</p>
                    </NumberOfJobsAppliedDiv>
                )}
                <BarGraphDiv>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={dataForBarChart}
                            margin={{ top: 15, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Jobs" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </BarGraphDiv>
            </GraphContainer>
        </JobsAppliedDateGraphDiv>
    );
};

export const JobsAppliedDateGraphDiv = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center; 
`;

export const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NumberOfJobsAppliedDiv = styled.div`
  display: flex;
  height: 15vh;
  width: 70vw;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 5vh;
`;

export const BarGraphDiv = styled.div`
  display: flex;
  margin-top: 10px;
  height: 60vh;
  width: 85vw;
  justify-content: center;
  align-items: center;
  margin-right: 12vw;
  
  @media ${device.laptop} {
    margin-right: 5vw;
  }
`;

export const MonthPickerDiv = styled.div`
  display: flex;
  height: 10vh;
  width: 70vw;
  align-items: center;
  justify-content: center;
  
  select {
    height: 30px;
  }
`;
