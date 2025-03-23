import React from "react";
import {
  BarChart,
  Bar,
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

interface GradeDistributionChartProps {
  data: Array<{
    grade: string;
    count: number;
  }>;
}

const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  data,
}) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="학생 수" fill={colors.primary.main} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default GradeDistributionChart;
