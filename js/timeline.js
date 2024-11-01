const data = {
    "Java": [
        {
            title: "11",
            segments: [
                { start: 2023, end: 2025, type: "Public", color: "#a8d5ff" },
                { start: 2025, end: 2030, type: "Commercial", color: "#ffe69c" }
            ]
        },
        {
            title: "17",
            segments: [
                { start: 2023, end: 2025, type: "Public", color: "#a8d5ff" },
                { start: 2025, end: 2030, type: "Commercial", color: "#ffe69c" }
            ]
        },
        {
            title: "21",
            segments: [
                { start: 2023.75, end: 2028, type: "Public", color: "#a8d5ff" },
                { start: 2027, end: 2031, type: "Commercial", color: "#ffe69c" }
            ]
        },
        {
            title: "25",
            segments: [
                { start: 2025.75, end: 2030, type: "Public", color: "#a8d5ff" },
                { start: 2029, end: 2031, type: "Commercial", color: "#ffe69c" }
            ]
        }
    ],
    "http4k LTS": [
        {
            title: "4.X (Java 8)",
            segments: [
                { start: 2023, end: 2023.25, type: "OSS", color: "#a8d5ff" },
                { start: 2023.25, end: 2025.25, type: "LTS", color: "#ffe69c" }
            ]
        },
        {
            title: "5.X (Java 8)",
            segments: [
                { start: 2023, end: 2025, type: "OSS", color: "#a8d5ff" },
                { start: 2025, end: 2027, type: "LTS", color: "#ffe69c" }
            ]
        },
        {
            title: "6.X (Java 21)",
            segments: [
                { start: 2025, end: 2027, type: "OSS", color: "#a8d5ff" },
                { start: 2027, end: 2029, type: "LTS", color: "#ffe69c" }
            ]
        },
        {
            title: "7.X (Java 25)",
            segments: [
                { start: 2027, end: 2029, type: "OSS", color: "#a8d5ff" },
                { start: 2029, end: 2031, type: "LTS", color: "#ffe69c" }
            ]
        }
    ]
}


function formatDate(year) {
    const wholeYear = Math.floor(year);
    const fractionalYear = year - wholeYear;
    const date = new Date(wholeYear, (fractionalYear * 12) +1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function calculateDayPosition(date) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const daysInYear = new Date(year, 11, 31).getDate() === 31 ? 366 : 365;
    return year + (dayOfYear / daysInYear);
}

function formatQuarter(year) {
    const wholeYear = Math.floor(year);
    const quarter = Math.floor((year - wholeYear) * 4) + 1;
    return `${wholeYear} Q${quarter}`;
}

function createTimeline(title, startYear = 2023, endYear = 2031) {
    const root = document.getElementById(title);
    root.innerHTML = ''; // Clear the root element

    // Calculate current date position
    const now = new Date();
    const currentPosition = calculateDayPosition(now);

    // Create container
    const containerDiv = document.createElement('div');
    containerDiv.className = 'timeline-container';

    // Create header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'timeline-header';
    headerDiv.innerHTML = "<b>"+title+"</b>";
    containerDiv.appendChild(headerDiv);

    // Create markers container
    const markersDiv = document.createElement('div');
    markersDiv.className = 'year-markers';
    containerDiv.appendChild(markersDiv);

    // Create timeline container
    const timelineDiv = document.createElement('div');
    timelineDiv.className = 'timeline-content';
    containerDiv.appendChild(timelineDiv);

    // Calculate the total width including the final year
    const totalYears = endYear - startYear;

    // Create year markers and quarter markers
    for (let year = startYear; year <= endYear; year++) {
        // Add year marker at the start of each year
        const yearMarker = document.createElement('div');
        yearMarker.className = 'year-marker';
        const position = ((year - startYear) / totalYears) * 100;
        yearMarker.style.left = `${position}%`;

        // Add year label
        const yearLabel = document.createElement('div');
        yearLabel.className = 'year-label';
        yearLabel.textContent = year;
        yearMarker.appendChild(yearLabel);

        // Add year line
        const yearLine = document.createElement('div');
        yearLine.className = 'year-line';
        yearMarker.appendChild(yearLine);

        markersDiv.appendChild(yearMarker);

        // Add quarter markers if not the last year
        if (year < endYear) {
            for (let quarter = 1; quarter < 4; quarter++) {
                const quarterPosition = ((year - startYear + quarter * 0.25) / totalYears) * 100;
                const quarterMarker = document.createElement('div');
                quarterMarker.className = 'quarter-marker';
                quarterMarker.style.left = `${quarterPosition}%`;
                markersDiv.appendChild(quarterMarker);
            }
        }
    }

    // Add current date line
    if (currentPosition >= startYear && currentPosition <= endYear) {
        const dateLinePosition = ((currentPosition - startYear) / totalYears) * 100;
        const dateLine = document.createElement('div');
        dateLine.className = 'current-date-line';
        dateLine.style.left = `${dateLinePosition}%`;
        dateLine.title = formatDate(currentPosition);
        timelineDiv.appendChild(dateLine);
    }

    // Create timeline rows
    data[title].forEach(row => {
        const timelineRow = document.createElement('div');
        timelineRow.className = 'timeline-row';

        const label = document.createElement('div');
        label.className = 'timeline-label';
        label.textContent = row.title;

        const chart = document.createElement('div');
        chart.className = 'timeline-chart';

        // Add light grid lines
        const timelineGrid = document.createElement('div');
        timelineGrid.className = 'timeline-grid';
        for (let year = startYear; year <= endYear; year++) {
            for (let quarter = 0; quarter < 4; quarter++) {
                if (year === endYear && quarter > 0) continue;
                const position = ((year - startYear + quarter * 0.25) / totalYears) * 100;
                const gridLine = document.createElement('div');
                gridLine.className = 'grid-line';
                gridLine.style.left = `${position}%`;
                timelineGrid.appendChild(gridLine);
            }
        }
        chart.appendChild(timelineGrid);

        // Add segments
        row.segments.forEach(segment => {
            const bar = document.createElement('div');
            bar.className = 'timeline-bar';

            // Calculate position and width with quarter precision
            const startPosition = ((segment.start - startYear) / totalYears) * 100;
            const width = ((segment.end - segment.start) / totalYears) * 100;

            bar.style.left = startPosition + '%';
            bar.style.width = width + '%';
            bar.style.backgroundColor = segment.color;

            // Add tooltip with quarter precision
            bar.title = `${segment.type}: ${formatQuarter(segment.start)} - ${formatQuarter(segment.end)}`;

            chart.appendChild(bar);
        });

        timelineRow.appendChild(label);
        timelineRow.appendChild(chart);
        timelineDiv.appendChild(timelineRow);
    });

    // Create legend
    const legendDiv = document.createElement('div');
    legendDiv.className = 'timeline-legend';

    // Get unique segment types and colors from the data
    const legendItems = new Set();
    data[title].forEach(row => {
        row.segments.forEach(segment => {
            legendItems.add(JSON.stringify({ type: segment.type, color: segment.color }));
        });
    });

    // Create legend items
    Array.from(legendItems).map(item => JSON.parse(item)).forEach(({ type, color }) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = color;

        const label = document.createElement('span');
        label.className = 'legend-label';
        label.textContent = type;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendDiv.appendChild(legendItem);
    });

    // Add current date to legend
    const currentDateLegend = document.createElement('div');
    currentDateLegend.className = 'legend-item';

    const currentDateLine = document.createElement('div');
    currentDateLine.className = 'legend-current-date';

    const currentDateLabel = document.createElement('span');
    currentDateLabel.className = 'legend-label';
    currentDateLabel.textContent = `Today (${formatDate(currentPosition)})`;

    currentDateLegend.appendChild(currentDateLine);
    currentDateLegend.appendChild(currentDateLabel);
    legendDiv.appendChild(currentDateLegend);

    containerDiv.appendChild(legendDiv);

    root.appendChild(containerDiv);
}
