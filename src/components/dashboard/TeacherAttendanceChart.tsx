import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styled from "@emotion/styled";

// 차트 컨테이너
const ChartContainer = styled.div`
  height: 250px;
  width: 100%;
`;

interface TeacherAttendanceChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors: string[];
}

const TeacherAttendanceChart: React.FC<TeacherAttendanceChartProps> = ({
  data,
  colors,
}) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({
              name,
              value,
              percent,
            }: {
              name: string;
              value: number;
              percent: number;
            }) => `${name} ${value}명 (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TeacherAttendanceChart;
