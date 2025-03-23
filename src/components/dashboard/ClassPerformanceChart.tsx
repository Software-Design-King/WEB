import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { colors } from "../common/Common.styles";
import styled from "@emotion/styled";

// 차트 컨테이너
const ChartContainer = styled.div`
  height: 250px;
  width: 100%;
`;

interface ClassPerformanceChartProps {
  data: Array<{
    month: string;
    avgScore: number;
  }>;
}

const ClassPerformanceChart: React.FC<ClassPerformanceChartProps> = ({
  data,
}) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[60, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgScore"
            name="평균 점수"
            stroke={colors.primary.main}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ClassPerformanceChart;
