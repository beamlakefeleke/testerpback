import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography } from 'antd';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement, // Import BarElement
} from 'chart.js';
import { BACKENDURL } from '../../helper/Urls';
const { Title } = Typography;

// Registering the necessary components
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement); // Add BarElement here

const ReportAnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [branchData, setBranchData] = useState(null);
    const [departmentData, setDepartmentData] = useState(null);

    useEffect(() => {
        // Fetch analytics data from backend
        axios.get(`${BACKENDURL}/reports/analytics`)
            .then(response => {
                setAnalyticsData(response.data);
            })
            .catch(error => {
                console.error('Error fetching analytics', error);
            });

        // Fetch branch data count
        axios.get(`${BACKENDURL}/organzation/branch/all`)
            .then(response => {
                setBranchData(response.data);
                console.log("Branch Data:", response.data);
            })
            .catch(error => {
                console.error('Error fetching branch counts', error);
            });

        // Fetch department data count
        axios.get(`${BACKENDURL}/organzation/department/all`)
            .then(response => {
                setDepartmentData(response.data);
                console.log("Department Data:", response.data);
            })
            .catch(error => {
                console.error('Error fetching department counts', error);
            });
    }, []);

    if (!analyticsData || !branchData || !departmentData) {
        return <div>Loading...</div>;
    }

    // Data transformation for charts
    const measurementData = {
        labels: analyticsData.measurementStats.map(stat => stat.reportMeasurement),
        datasets: [
            {
                data: analyticsData.measurementStats.map(stat => stat._count.reportMeasurement),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const locationData = {
        labels: analyticsData.locationStats.map(stat => stat.location),
        datasets: [
            {
                label: 'Reports by Location',
                data: analyticsData.locationStats.map(stat => stat._count.location),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const shiftData = {
        labels: analyticsData.shiftStats.map(stat => stat.shiftTime),
        datasets: [
            {
                label: 'Reports by Shift Time',
                data: analyticsData.shiftStats.map(stat => stat.shiftTime),
                backgroundColor: '#FF6384',
            },
        ],
    };

    const dateData = {
        labels: analyticsData.dateStats.map(stat => stat.date),
        datasets: [
            {
                label: 'Reports by Date',
                data: analyticsData.dateStats.map(stat => stat._count.date),
                backgroundColor: '#36A2EB',
            },
        ],
    };


    // Branch count card data
    const branchCount = branchData.branchs.length;

    // Department count card data
    const departmentCount = departmentData.departments.length;

    return (
        <div style={{ padding: '30px', backgroundColor: '#f4f7fc' }}>
            <Title level={2} style={{ marginBottom: '30px', textAlign: 'center' }}>Report Analytics Dashboard</Title>

            <Row gutter={[16, 16]}>
                {/* Branch Count */}
                <Col span={8}>
                    <Card 
                        title="Number of Branches" 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', textAlign: 'center' }}
                    >
                        <Title level={3}>{branchCount}</Title>
                    </Card>
                </Col>

                {/* Department Count */}
                <Col span={8}>
                    <Card 
                        title="Number of Departments" 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', textAlign: 'center' }}
                    >
                        <Title level={3}>{departmentCount}</Title>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card 
                        title="Number of Business" 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', textAlign: 'center' }}
                    >
                        <Title level={3}>12</Title>
                    </Card>
                </Col>

            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>


                {/* Reports by Measurement */}
                <Col span={12}>
                    <Card 
                        title="Reports by Measurement" 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
                    >
                        <Pie data={measurementData} />
                    </Card>
                </Col>

                                {/* Reports by Date */}
                                <Col span={12}>
                    <Card 
                        title="Reports by Date" 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
                    >
                        <Bar data={dateData} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                {/* Reports by Location */}
                <Col span={12}>
                    <Card 
                        title="Reports by Location" 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
                    >
                        <Bar data={locationData} />
                    </Card>
                </Col>

                {/* Reports by Shift Time */}
                <Col span={12}>
                    <Card 
                        title="Reports by Shift Time" 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
                    >
                        <Bar data={shiftData} />
                    </Card>
                </Col>
            </Row>

        </div>
    );
};

export default ReportAnalyticsPage;
