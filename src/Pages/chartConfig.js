
export const getDoughnutChartConfig = (recentData) => ({
    labels: ['Right Up', 'Left Up', 'Success Reps'],
    datasets: [
      {
        data: [
          recentData.leftUp || 0, 
          recentData.rightUp || 0, 
          recentData.successReps || 0
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],      
      },
    ],  
});

export const doughnutOptions = {
    plugins: {
      centerText: {}, 
      customCanvasBackgroundColor: {
        color: 'lightGreen',
      },
      sectionText: {},
    },
    legend: {
      display: true,
      position: 'right'
    }
  };

export const getLineChartConfig = (dates, successRates, leftUpRates, rightUpRates) => ({
    labels: dates,
    datasets: [
        {
            label: 'Success Rate',
            data: successRates,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
        },
        {
            label: 'Right Up Rate',
            data: leftUpRates,
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            fill: true,
        },
        {
            label: 'Left Up Rate',
            data: rightUpRates,
            borderColor: 'rgba(54,162,235,1)',
            backgroundColor: 'rgba(54,162,235,0.2)',
            fill: true,
        },
    ],
})

export const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Over Time'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Rate (%)'
        },
        beginAtZero: true
      },
    },
};

export const getShoulderLiveLineChartConfig = (labels, leftWristYData, rightWristYData) => ({
    labels: labels,
    datasets: [
        {
            label: 'Left Wrist Y',
            data: leftWristYData,
            borderColor: 'rgba(54, 162, 235, 1)', // 데이터셋 라인 색상
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
        },
        {
            label: 'Right Wrist Y',
            data: rightWristYData,
            borderColor: 'rgba(255, 99, 132, 1)', // 데이터셋 라인 색상
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
        },
    ],
});

export const shoulderLiveLineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'Wrist Movement Over Time'
        }
    },
    scales: {
        x: {
        title: {
            display: true,
            text: 'Time'
        }
        },
        y: {
        title: {
            display: true,
            
        },
        beginAtZero: true
        },
    },
};


